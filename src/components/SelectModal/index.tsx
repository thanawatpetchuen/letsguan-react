import { Button, Card, Container, Grid, Modal, Text } from '@nextui-org/react';
import { useCallback } from 'react';

export type SelectModalProps<T> = {
  title: string;
  visible?: boolean;
  closeHandler: (e?: T) => void;
  data: T[];
  textSelector: (e: T) => string;
};

const SelectModal = <T extends object>({
  textSelector,
  data,
  visible,
  closeHandler,
  title,
}: SelectModalProps<T>) => {
  const onClick = useCallback(
    (e: T) => {
      closeHandler(e);
    },
    [closeHandler],
  );

  return (
    <Modal closeButton aria-labelledby='modal-title' open={visible} onClose={() => closeHandler()}>
      <Modal.Header>
        <Text id='modal-title' size={18}>
          {title}
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Grid.Container gap={0}>
          {data.map((e, i) => (
            <Grid key={i}>
              <Container css={{ minWidth: 170, minHeight: 80, padding: 10 }}>
                <Card
                  isHoverable
                  isPressable
                  onClick={() => onClick(e)}
                  variant='flat'
                  css={{
                    '&:hover': {
                      background: '$colors$primary',
                      color: 'white',
                    },
                    '&:hover p': {
                      color: 'white',
                    },
                  }}
                >
                  <Card.Body>
                    <Text weight='bold' css={{ textAlign: 'center' }} color='black'>
                      {textSelector(e)}
                    </Text>
                  </Card.Body>
                </Card>
              </Container>
            </Grid>
          ))}
        </Grid.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color='error' onClick={() => closeHandler()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// SelectModal.defaultProps = defaultProps;

export default SelectModal;
