// ----- external modules ----- //
import { Select } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  sortOption: string
  setSortOption: Dispatch<SetStateAction<string>>
}

export default function Sort ({
  sortOption,
  setSortOption
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
      <option value='oldest'>Oldest to Newest</option>
      <option value='newest'>Newest to Oldest</option>
      <option value='cheap'>Price - Low to High</option>
      <option value='expensive'>Price - High to Low</option>
    </Select>
  )
}
