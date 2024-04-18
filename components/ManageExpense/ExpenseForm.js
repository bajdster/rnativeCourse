import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import Input from './Input'
import Button from '../UI/Button'
import { getFormattedDate } from '../../util/date'
import { GlobalStyles } from '../../constants/styles'

const ExpenseForm = ({onCancel, onSubmit, submitButtonLabel, defaultValues}) => {

  const [inputs, setInputs] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : '', isValid: true
    },
    date: 
    {
      value: defaultValues ? getFormattedDate(defaultValues.date) : '', isValid: true
    },
    description: {
      value: defaultValues ? defaultValues.description : '',
      isValid: true
    }
  })

function inputChangeHandler(inputIdentifier, enteredValue)
{
  setInputs((curInputs)=>{
    return {
      ...curInputs,
      [inputIdentifier]: {value: enteredValue, isValid: true}
    }
  })
}

function submitHandler()
{
  const expenseData = {
    amount: +inputs.amount.value,
    date: new Date(inputs.date.value),
    description: inputs.description.value
  }

  //validation
  const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0
  const dateIsValid = expenseData.date.toString() !== 'Invalid Date';
  const descriptionIsValid = expenseData.description.trim().length > 0;

  if (!amountIsValid || !dateIsValid || !descriptionIsValid)
  {
    //show some feedback
    // Alert.alert("Invalid input", 'Please check your input values')
    setInputs((curInputs)=>{
      return {
        amount: {value: curInputs.amount.value, isValid: amountIsValid},
        date: {value: curInputs.date.value, isValid: dateIsValid},
        description: {value: curInputs.description.value, isValid: descriptionIsValid}
      }
    })
    return;
  }

  onSubmit(expenseData)
}

const formIsInvalid = !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid

  return (
    <View style={styles.formStyle}>
      <Text style={styles.title}>Your Expense</Text>
      <View style={styles.inputsRow}>
          <Input style={styles.rowInput} label="Amount" invalid={!inputs.amount.isValid} textInputConfig={{
              keyboardType: 'decimal-pad',
              onChangeText: inputChangeHandler.bind(this, 'amount'),
              value: inputs.amount.value
          }}/>
          <Input style={styles.rowInput} label="Date" invalid={!inputs.date.isValid} textInputConfig={{
              placeholder: "YYYY-MM-DD",
              maxLength: 10,
              value: inputs.date.value,
              onChangeText: inputChangeHandler.bind(this, 'date'),
          }}/>
      </View>
        <Input label="Description" invalid={!inputs.description.isValid} textInputConfig={{
            multiline: true,
            value: inputs.description.value,
            onChangeText: inputChangeHandler.bind(this, 'description')
            // autoCapitalize: 'sentences'
            //autoCorrect: false
        }}/>

        {formIsInvalid && <Text style={styles.errorText}>Invalid inputs values - please check your entered data!</Text>}
        <View style={styles.buttons}>
          <Button style={styles.button} mode="flat" onPress={onCancel}>Cancel</Button>
          <Button style={styles.button} onPress={submitHandler}>{submitButtonLabel}</Button>
        </View>
    </View>
  )
}

export default ExpenseForm

const styles = StyleSheet.create({
  inputsRow:
  {
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  rowInput:{
    flex:1
  },
  formStyle:
  {
    marginTop:40
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical:24,
    textAlign:'center'
  },
  buttons:{
    flexDirection:'row',
    justifyContent: 'center',
    alignItems:'center'
  },
  button:{
    minWidth: 120,
    marginHorizontal: 8,
  },
  errorText:
  {
    textAlign: 'center',
    color: GlobalStyles.colors.error500,
    margin: 8
  }
})