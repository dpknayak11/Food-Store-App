"use client";
import { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import AddressModal from "@/components/AddressModal";
import { httpPost, httpDelete, httpGet } from "@/services/api";
import { clearAddress, setAddress } from "@/redux/slices/addressSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { address = [] } = useSelector((state) => state.address);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullAddress: "",
    phone: "",
    isDefault: false,
  });



  // Fetch addresses on component mount
const fetchAddresses = async () => {
  try {
    setIsLoading(true);
    const res = await httpGet("/address");
    if (!res.error) {
      dispatch(clearAddress());               // old cache clear
      dispatch(setAddress(res.data || []));   // fresh store + session save
    } else {
      toast.error(res.message || "Failed to fetch addresses");
    }
  } catch (err) {
    toast.error("Failed to fetch addresses");
  } finally {
    setIsLoading(false);
  }
};
  // Open modal for new address
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      fullAddress: "",
      phone: "",
      isDefault: false,
    });
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (addr) => {
    setEditingId(addr._id);
    setFormData(addr);
    setShowModal(true);
  };

  // Submit form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullAddress || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setIsLoading(true);
      // Ensure boolean value
      const payload = {
        ...formData,
        isDefault: !!formData.isDefault,
      };
      let res;
      if (editingId) {
        // ✅ Update existing address
        res = await httpPost("/address/update", {
          ...payload,
          id: editingId,
        });
      } else {
        // ✅ Create new address
        res = await httpPost("/address/create", payload);
      }
      if (!res.error) {
        await fetchAddresses();
        toast.success(
          editingId
            ? "Address updated successfully"
            : "Address created successfully",
        );
        setShowModal(false);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete address
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      setIsLoading(true);
      const res = await httpDelete(`/address/${id}`);
      if (!res.error) {
        await fetchAddresses();
        toast.success("Address deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete address");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  // Set as default
  const handleSetDefault = async (id) => {
    try {
      setIsLoading(true);
      const res = await httpPost("/address/update", { id, isDefault: true });
      if (!res.error) {
        await fetchAddresses();
        toast.success("Default address set successfully");
      } else {
        toast.error(res.message || "Failed to set default");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  useEffect(() => {
    if(address?.length > 0) return;
    // Fetch addresses when component mounts
    fetchAddresses();
  }, []);
  return (
    <>
      <Navbar />
      <Container className="my-5">
        {/* User Profile Section */}
        <Row className="justify-content-center mb-5">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="border-bottom pb-3">
                  My Profile
                </Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {user?.name} <br />
                  <strong>Email:</strong> {user?.email} <br />
                  <strong>Phone:</strong> {user?.phoneNumber || "Not provided"}{" "}
                  <br />
                  <strong>Created At:</strong>{" "}
                  {user?.createdAt
                    ? new Date(Number(user.createdAt)).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : "—"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Addresses Section */}
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>My Addresses</h4>
              <Button
                variant="primary"
                onClick={handleAddNew}
                disabled={isLoading}
              >
                + New Address
              </Button>
            </div>

            {Array.isArray(address) && address.length > 0 ? (
              <Row>
                {address.map((addr) => (
                  <Col md={6} key={addr._id} className="mb-4">
                    <Card
                      className={`shadow-sm ${addr.isDefault ? "border-primary" : ""}`}
                    >
                      <Card.Body>
                        {addr.isDefault && (
                          <div className="badge bg-primary mb-2">
                            Default Address
                          </div>
                        )}
                        <Card.Title>Address</Card.Title>
                        <Card.Text>
                          <strong>Address:</strong> {addr.fullAddress} <br />
                          <strong>Phone:</strong> {addr.phone} <br />
                        </Card.Text>
                        <div className="d-grid gap-2 mt-3">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleEdit(addr)}
                            disabled={isLoading}
                          >
                            Edit
                          </Button>
                          {!addr.isDefault && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleSetDefault(addr._id)}
                              disabled={isLoading}
                            >
                              Set as Default
                            </Button>
                          )}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(addr._id)}
                            disabled={isLoading}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="text-center p-4">
                <p className="text-muted">
                  No addresses added yet. Click "Add New Address" to create one.
                </p>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      <AddressModal
        showModal={showModal}
        setShowModal={setShowModal}
        editingId={editingId}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
