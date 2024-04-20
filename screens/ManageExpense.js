import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useLayoutEffect, useContext, useState } from 'react'
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import Button from '../components/UI/Button';
import { ExpensesContext } from '../store/expenses-context';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import { deleteExpense, storeExpense, updateExpense } from '../util/http';
import LoadingOverlay from '../components/UI/LoadingOverlay';

const ManageExpense = ({route, navigation}) => {

const [isSubmitting, setIsSubmitting] = useState(false)
const expenseCtx = useContext(ExpensesContext)

const editedExpenseId = route.params?.expenseId
const  isEditing = !!editedExpenseId;

const selectedExpense = expenseCtx.expenses.find(expense => expense.id === editedExpenseId)

useLayoutEffect(()=>
{
  navigation.setOptions({
    title: isEditing ? 'Edit Expense' : 'Add Expense'
  })
}, [isEditing, navigation])

async function deleteExpenseHandler()
{
  setIsSubmitting(true)
  await deleteExpense(editedExpenseId)
  setIsSubmitting(false)
  expenseCtx.deleteExpense(editedExpenseId)
  navigation.goBack();
}

function cancelHandler()
{
  navigation.goBack();
}

async function confirmHandler(expenseData)
{
  setIsSubmitting(true)
  if(isEditing)
  {
    expenseCtx.updateExpense(editedExpenseId, expenseData)
    await updateExpense(editedExpenseId, expenseData)
  }
  else
  {
    const id = await storeExpense(expenseData)
    expenseCtx.addExpense({...expenseData, id:id})
  }
  navigation.goBack();
}

if(isSubmitting)
{
  return <LoadingOverlay/>
}

  return (
    <View style={styles.container}>
      <ExpenseForm onCancel={cancelHandler} onSubmit={confirmHandler} submitButtonLabel={isEditing ? "Update" : "Add"} defaultValues={selectedExpense}/>

      {isEditing && 
      <View style={styles.deleteContainer}>
        <IconButton icon='trash' color={GlobalStyles.colors.error500} size={36} onPress={deleteExpenseHandler}/>
      </View>}
    </View>
  )
}

export default ManageExpense

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:24,
    backgroundColor: GlobalStyles.colors.primary800
  },
  deleteContainer:{
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth:2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center'
  },
 
})