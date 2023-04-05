'use client'

// ----- external modules ----- //
import {
  Stat,
  VStack,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Text,
  Link
} from '@chakra-ui/react'

// ----- internal modules ----- //
import { getReceiptByTotal } from '@/utils/itemStats'
// components

// types
import { StatsPgql, ReceiptPgql } from '@/common/types/pgql_types'

interface Props {
  statsData: StatsPgql
  receiptsData: ReceiptPgql[]
}

export default function GeneralInsights ({
  statsData,
  receiptsData
}: Props): JSX.Element {
  const totalSpend = statsData.sum.total
  const totalPurchases = statsData.distinctCount.receiptNumber

  // most expensive purchase
  const mostExpensivePurchase = statsData.max.total
  const mostExpensivePurchaseDetails = getReceiptByTotal(
    mostExpensivePurchase,
    receiptsData
  )

  // cheapest purchase
  const cheapestPurchase = statsData.min.total
  const cheapestPurchaseDetails = getReceiptByTotal(
    cheapestPurchase,
    receiptsData
  )

  // earliest purchase
  const earliestPurchase = receiptsData[0]

  // average spend
  const averageSpenditure = parseFloat(statsData.average.total).toFixed(2)

  return (
    <VStack w='100%' spacing={4} align='flex-start'>
      <Text fontSize={22} color='main' fontWeight={600}>
        General Insights
      </Text>
      <StatGroup
        backgroundColor='blackAlpha.50'
        p='20px 25px'
        borderRadius={8}
        color='main'
        w='100%'
      >
        <Stat>
          <StatLabel fontSize={15}>Total Spend (all time)</StatLabel>
          <StatNumber color='secondary'>${totalSpend}</StatNumber>

          <Link
            href={`/protected/purchaseHistory/${earliestPurchase.receiptNumber}`}
          >
            <StatHelpText>
              earliest was captured on {earliestPurchase.purchaseDate}
            </StatHelpText>
          </Link>
        </Stat>

        <Stat>
          <StatLabel fontSize={15}>Total Purchases</StatLabel>
          <StatNumber color='secondary'>{totalPurchases}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel fontSize={15}>Most expensive purchase</StatLabel>
          <StatNumber color='secondary'>${mostExpensivePurchase}</StatNumber>
          <Link
            href={`/protected/purchaseHistory/${mostExpensivePurchaseDetails.receiptNumber}`}
          >
            <StatHelpText>
              was made on {mostExpensivePurchaseDetails.purchaseDate}
            </StatHelpText>
          </Link>
        </Stat>

        <Stat>
          <StatLabel fontSize={15}>Cheapest purchase</StatLabel>
          <StatNumber color='secondary'>${cheapestPurchase}</StatNumber>
          <Link
            href={`/protected/purchaseHistory/${cheapestPurchaseDetails.receiptNumber}`}
          >
            <StatHelpText>
              was made on {cheapestPurchaseDetails.purchaseDate}
            </StatHelpText>
          </Link>
        </Stat>

        <Stat>
          <StatLabel fontSize={15}>In average you spend</StatLabel>
          <StatNumber color='secondary'>${averageSpenditure}</StatNumber>
        </Stat>
      </StatGroup>
    </VStack>
  )
}
