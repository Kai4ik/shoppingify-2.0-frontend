// ----- external modules ----- //
import { Select } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  sortOption: string
  setSortOption: Dispatch<SetStateAction<string>>
  options: Array<{ value: string, label: string }>
}

export default function Sort ({
  sortOption,
  setSortOption,
  options
}: Props): JSX.Element {
  return (
    <Select
      w={['50%', '20%']}
      variant='filled'
      size='sm'
      color='main'
      _hover={{
        borderColor: 'gray.200'
      }}
      _focus={{
        borderColor: 'gray.200'
      }}
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}
