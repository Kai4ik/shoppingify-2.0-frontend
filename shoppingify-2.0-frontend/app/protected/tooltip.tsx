'use client'

// external modules
import { Tooltip, WrapItem, Icon } from '@chakra-ui/react'
import { IconType } from 'react-icons/lib'
import NextLink from 'next/link'

interface Props {
  label: string
  size: number
  link: string
  icon: IconType
}

export default function TooltipCn ({
  label,
  link,
  size,
  icon
}: Props): JSX.Element {
  return (
    <Tooltip
      label={label}
      aria-label={label}
      placement='right'
      gutter={18}
      hasArrow
      bg='main'
      color='secondary'
      closeOnScroll
    >
      <WrapItem>
        <NextLink href={link}>
          <Icon
            as={icon}
            boxSize={size}
            _hover={{ color: 'secondary', boxSize: size + 1 }}
            cursor='pointer'
            color='main'
          />
        </NextLink>
      </WrapItem>
    </Tooltip>
  )
}
