import { Button, Card, Container, Grid, Modal, Text } from '@nextui-org/react';
import { useCallback, useState } from 'react';

export type MultiSelectModalProps<T> = {
  title: string;
  visible?: boolean;
  closeHandler: (e?: T[]) => void;
  data: T[];
  textSelector: (e: T) => string;
  keySelector: (e: T) => string;
};

const MultiSelectModal = <T extends object>({
  textSelector,
  keySelector,
  data,
  visible,
  closeHandler,
  title,
}: MultiSelectModalProps<T>) => {
  const [selected, setSelected] = useState<T[]>([]);

  const onClick = useCallback(
    (e: T) => {
      if (e) {
        const index = selected.findIndex((s) => keySelector(s) == keySelector(e));
        if (index >= 0) {
          const cloneSelected = Object.assign([], selected);
          cloneSelected.splice(index, 1);
          setSelected(cloneSelected);
        } else {
          setSelected([...selected, e]);
        }
      }
    },
    [keySelector, selected],
  );

  const onOK = useCallback(() => {
    closeHandler(selected);
    setSelected([]);
  }, [closeHandler, selected]);

  const isActive = useCallback(
    (e: T) => {
      return selected.some((s) => keySelector(s) === keySelector(e));
    },
    [keySelector, selected],
  );

  return (
    <Modal
      blur
      closeButton
      aria-labelledby='modal-title'
      open={visible}
      onClose={() => closeHandler()}
    >
      <Modal.Header>
        <Text id='modal-title' size={18}>
          {title}
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Grid.Container gap={1} css={{ maxHeight: 300, p: 0 }}>
          {data.map((e, i) => (
            <Grid key={i} css={{ minWidth: '50%' }}>
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
                  background: isActive(e) ? '$colors$primary' : '',
                  '& p': {
                    color: isActive(e) ? 'white' : '',
                  },
                }}
              >
                <Card.Body>
                  <Text weight='bold' css={{ textAlign: 'center' }} color='black'>
                    {textSelector(e)}
                  </Text>
                </Card.Body>
              </Card>
              {/* <Container css={{ minWidth: 150, minHeight: 80 }}>
              </Container> */}
            </Grid>
          ))}
        </Grid.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat onClick={onOK}>
          OK
        </Button>
        <Button auto flat color='error' onClick={() => closeHandler()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MultiSelectModal;
