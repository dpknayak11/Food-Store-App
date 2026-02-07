import { Form, Modal, Button } from "react-bootstrap";

export default function AddressModal({
  showModal,
  setShowModal,
  editingId,
  formData,
  handleInputChange,
  handleSubmit,
  isLoading,
}) {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingId ? "Edit Address" : "Add New Address"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Address *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleInputChange}
              placeholder="Enter complete address details"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number *</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="isDefault"
              label="Set as default address"
              checked={formData.isDefault}
              onChange={handleInputChange}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : editingId ? "Update Address" : "Create Address"}
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
