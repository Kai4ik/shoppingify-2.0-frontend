"use client";

// ----- external modules ----- //
import { Stack, StatGroup } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

export default function StatGroupCp({ children }: Props): JSX.Element {
  return (
    <StatGroup
      backgroundColor="blackAlpha.50"
      p="20px 25px"
      borderRadius={8}
      color="main"
      w="100%"
    >
      <Stack direction={["column", "row"]} w="100%" align="flex-start">
        {children}
      </Stack>
    </StatGroup>
  );
}
