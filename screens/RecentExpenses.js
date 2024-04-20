import { View, Text } from 'react-native'
import React, {useContext, useEffect, useState} from 'react'
import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput'
import { ExpensesContext } from '../store/expenses-context'
import { getDateMinusDays } from '../util/date'
import { fetchExpenses } from '../util/http'
import LoadingOverlay from "../components/UI/LoadingOverlay"

const RecentExpenses = () => {

  const [isFetching, setIsFetching] = useState(false)
  const expensesCtx = useContext(ExpensesContext)

  useEffect(()=>{

    async function getExpenses()
    {
      setIsFetching(true);
      const expenses = await fetchExpenses();
      setIsFetching(false)
      expensesCtx.setExpenses(expenses)
    }

    getExpenses()
  },[])

  if(isFetching)
  {
    return <LoadingOverlay/>
  }

  const recentExpenses = expensesCtx.expenses.filter((expense)=>{
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);

    return (expense.date >= date7DaysAgo) && (expense.date <= today)
  })

  return (
    <ExpensesOutput expensesPeriod={"Last 7 days"} expenses={recentExpenses} fallbackText="No recent expenses last 7 days"/>
  )
}

export default RecentExpenses