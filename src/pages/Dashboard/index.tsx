import React, { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";
import { useAuth } from "../../hooks/auth";

import {
  Container,
  Header,
  HeaderWrapper,
  UserInfo,
  UserPhoto,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadingContainer,
} from "./styles";

import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface CardsProps {
  amount: string;
  lastTransaction: string;
}
interface CardsData {
  entries: CardsProps;
  expensives: CardsProps;
  total: CardsProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const [transactions, setTransactions] = useState<DataListProps[]>();
  const [cardData, setCardData] = useState<CardsData>({} as CardsData);

  const theme = useTheme();

  const { user, signOut } = useAuth();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: "positive" | "negative"
  ) {
    const collectionFilttered = collection.filter(
      (transaction) => transaction.type === type
    );

    if (collectionFilttered.length === 0) return 0;

    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFilttered.map((transaction) =>
          new Date(transaction.date).getTime()
        )
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      "pt-br",
      { month: "long" }
    )}`;
  }

  async function loadTransaction() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);

    const transactions = response ? JSON.parse(response) : [];

    let entriesSum = 0;
    let expensiveSum = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        item.type === "positive"
          ? (entriesSum += Number(item.amount))
          : (expensiveSum += Number(item.amount));

        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      }
    );

    setTransactions(transactionsFormatted);

    const lastEntrieTransaction = getLastTransactionDate(
      transactions,
      "positive"
    );
    const lastExpenseTransaction = getLastTransactionDate(
      transactions,
      "negative"
    );
    const totalInterval =
      lastExpenseTransaction === 0
        ? "Não houveram transaçōes nos últimos dias!"
        : `01 à ${lastExpenseTransaction}`;

    const total = entriesSum - expensiveSum;
    setCardData({
      entries: {
        amount: entriesSum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction:
          lastEntrieTransaction === 0
            ? "Não houve nenhuma entrada nos últimos dias."
            : `Última entrada dia ${lastEntrieTransaction}`,
      },
      expensives: {
        amount: expensiveSum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction:
          lastExpenseTransaction === 0
            ? "Não houve nenhuma saída nos últimos dias."
            : `Última entrada dia ${lastExpenseTransaction}`,
      },
      total: {
        amount: total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: totalInterval,
      },
    });

    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadTransaction();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <>
          <Header>
            <HeaderWrapper>
              <UserInfo>
                <UserPhoto
                  source={{
                    uri: user.image,
                  }}
                />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </HeaderWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={cardData?.entries?.amount}
              lastTransaction={cardData.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Saídas"
              amount={cardData?.expensives?.amount}
              lastTransaction={cardData.expensives.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={cardData?.total?.amount}
              lastTransaction={cardData.total.lastTransaction}
              type="total"
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
