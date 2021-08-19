import { useRef, useState } from 'react';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';

export function WarningAlertDialog() {
  const [isOpen, setIsOpen] = useState(true);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bgColor="gray.900">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Atenção
            </AlertDialogHeader>

            <AlertDialogBody>
              Página ainda em construção. Alguns recursos podem não estar
              disponíveis ou otimizados.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="yellow" onClick={onClose} ml={3}>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
