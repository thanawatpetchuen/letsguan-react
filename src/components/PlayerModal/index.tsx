import { Button, Input, Modal, Text } from '@nextui-org/react';
import { useFormik } from 'formik';
import { Player } from '../../types/player';

export type PlayerModalProps = {
  title: string;
  visible?: boolean;
  closeHandler: (e?: Player) => void;
};

const initialValues: Player = {
  name: '',
  id: '',
};

const PlayerModal = ({ visible, closeHandler, title }: PlayerModalProps) => {
  const { values, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues,
    onSubmit: (v) => {
      closeHandler(v);
    },
  });

  return (
    <Modal closeButton aria-labelledby='modal-title' open={visible} onClose={() => closeHandler()}>
      <form onSubmit={handleSubmit}>
        <Modal.Header>
          <Text id='modal-title' size={18}>
            {title}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            value={values.name}
            label='Player Name'
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button type='submit' auto flat>
            OK
          </Button>
          <Button auto flat color='error' onClick={() => closeHandler()}>
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default PlayerModal;
