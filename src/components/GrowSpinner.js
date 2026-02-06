"use client";
import Spinner from 'react-bootstrap/Spinner';

function GrowSpinner() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <Spinner animation="grow" variant="danger" style={{ width: '3rem', height: '3rem' }} />
    </div>
  );
}

export default GrowSpinner;