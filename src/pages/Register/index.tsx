import React, { useState, useEffect } from "react";
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import { useForm } from "react-hook-form";

import { InputForm } from "../../components/Form/InputForm";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButtons } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";

import { CategorySelect } from "../CategorySelect";

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from "./styles";

export type FormData = {
  [name: string]: any;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório!"),
  amount: Yup.number()
    .typeError("Informe um valor numérico!")
    .positive("O valor não pode ser negativo!")
    .required("A quantia é necessária!"),
});

export function Register() {
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });

  const { navigate }: NavigationProp<ParamListBase> = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleTransactionsTypeSelect(type: "up" | "down") {
    setTransactionType(type);
  }

  function handleModalCloseSelectCategory() {
    setCategoryModalOpen(false);
  }

  function handleModalOpenSelectCategory() {
    setCategoryModalOpen(true);
  }

  async function handleRegister(form: FormData) {
    if (!transactionType) return Alert.alert("Selecione uma transacão!");
    if (category.key === "category")
      return Alert.alert("Selecione uma categoria!");

    const dataKey = "@gofinances:transactions";

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      category: category.key,
      transactionType,
      date: new Date(),
    };

    function resetData() {
      reset();
      setTransactionType("");
      setCategory({
        key: "category",
        name: "Categoria",
      });
    }

    try {
      const allData = await AsyncStorage.getItem(dataKey);
      const currentAllData = allData ? JSON.parse(allData) : [];

      const allDataFormatted = [...currentAllData, newTransaction];

      await AsyncStorage.setItem(dataKey, JSON.stringify(allDataFormatted));

      resetData();

      navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar!");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preco"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionsTypes>
              <TransactionTypeButtons
                type="up"
                title="Income"
                onPress={() => handleTransactionsTypeSelect("up")}
                isActive={transactionType === "up"}
              />
              <TransactionTypeButtons
                type="down"
                title="Outcome"
                onPress={() => handleTransactionsTypeSelect("down")}
                isActive={transactionType === "down"}
              />
            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleModalOpenSelectCategory}
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>
        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleModalCloseSelectCategory}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
