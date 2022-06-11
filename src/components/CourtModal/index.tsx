import { Button, Input, Modal, Text } from '@nextui-org/react';
import { useFormik } from 'formik';
import { Court } from '../../types/fixture';

export type CourtModalProps = {
  title: string;
  visible?: boolean;
  closeHandler: (e?: Court) => void;
};

const initialValues: Court = {
  name: '',
  numberOfPlayers: 2,
  id: '',
};

const CourtModal = ({ visible, closeHandler, title }: CourtModalProps) => {
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
            label='Court Name'
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

export default CourtModal;
