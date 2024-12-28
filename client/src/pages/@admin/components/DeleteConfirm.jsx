/* eslint-disable react/prop-types */
import { Modal, Button } from 'antd';

const DeleteModal = ({ show, onCancel, onConfirm }) => {

  return (
    <Modal
      open={show}
      title="Confirm Delete"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="delete" type="primary" danger onClick={onConfirm}>
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete</p>
    </Modal>
  );
};

export default DeleteModal;