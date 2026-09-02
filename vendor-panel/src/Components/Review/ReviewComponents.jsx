import React, { useState } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { cilSearch, cilTrash } from "@coreui/icons";

const ProductReviews = () => {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");

  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: "Rahul Sharma",
      email: "rahul@gmail.com",
      product: "Nike Air Max 270",
      rating: 5,
      review:
        "Amazing shoes! Very comfortable and the quality is excellent.",
      date: "28 Aug 2026",
      status: "Published",
    },
    {
      id: 2,
      customer: "Aman Khan",
      email: "aman@gmail.com",
      product: "Adidas Ultraboost",
      rating: 4,
      review:
        "Good quality and comfortable. Delivery was also fast.",
      date: "26 Aug 2026",
      status: "Published",
    },
    {
      id: 3,
      customer: "Priya Verma",
      email: "priya@gmail.com",
      product: "Puma Running Shoes",
      rating: 3,
      review:
        "Product is okay but the size was slightly different.",
      date: "24 Aug 2026",
      status: "Published",
    },
    {
      id: 4,
      customer: "Arjun Patel",
      email: "arjun@gmail.com",
      product: "Nike Revolution 6",
      rating: 5,
      review:
        "Excellent product. Highly recommended.",
      date: "21 Aug 2026",
      status: "Published",
    },
    {
      id: 5,
      customer: "Sneha Singh",
      email: "sneha@gmail.com",
      product: "Adidas Runfalcon",
      rating: 2,
      review:
        "Quality could be better for this price.",
      date: "19 Aug 2026",
      status: "Published",
    },
  ]);

  // Filter Reviews
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer.toLowerCase().includes(search.toLowerCase()) ||
      review.email.toLowerCase().includes(search.toLowerCase()) ||
      review.product.toLowerCase().includes(search.toLowerCase());

    const matchesRating =
      ratingFilter === "All" ||
      review.rating === Number(ratingFilter);

    return matchesSearch && matchesRating;
  });

  // Delete Review
  const handleDelete = (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId)
    );
  };

  // Rating Stars
  const renderStars = (rating) => {
    return (
      <span>
        {"★".repeat(rating)}
        <span className="text-body-secondary">
          {"★".repeat(5 - rating)}
        </span>
      </span>
    );
  };

  // Stats
  const totalReviews = reviews.length;

  const publishedReviews = reviews.filter(
    (review) => review.status === "Published"
  ).length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="p-3">

      {/* Page Header */}
      <CRow className="mb-4">
        <CCol>
          <h3 className="fw-bold mb-1">
            Product Reviews
          </h3>

          <p className="text-body-secondary mb-0">
            Manage customer reviews and ratings for your products
          </p>
        </CCol>
      </CRow>

      {/* Stats */}
      <CRow className="mb-4">

        <CCol md={4} className="mb-3 mb-md-0">
          <CCard className="border-0 shadow-sm h-100">
            <CCardBody>
              <p className="text-body-secondary mb-1">
                Total Reviews
              </p>

              <h3 className="fw-bold mb-0">
                {totalReviews}
              </h3>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={4} className="mb-3 mb-md-0">
          <CCard className="border-0 shadow-sm h-100">
            <CCardBody>
              <p className="text-body-secondary mb-1">
                Published Reviews
              </p>

              <h3 className="fw-bold mb-0">
                {publishedReviews}
              </h3>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={4}>
          <CCard className="border-0 shadow-sm h-100">
            <CCardBody>
              <p className="text-body-secondary mb-1">
                Average Rating
              </p>

              <h3 className="fw-bold mb-0">
                ⭐ {averageRating}
              </h3>
            </CCardBody>
          </CCard>
        </CCol>

      </CRow>

      {/* Reviews Table */}
      <CCard className="border-0 shadow-sm">

        <CCardHeader className="bg-white py-3">
          <CRow className="align-items-center">

            {/* Title */}
            <CCol md={5}>
              <h5 className="fw-semibold mb-0">
                Customer Reviews
              </h5>
            </CCol>

            {/* Search */}
            <CCol md={4} className="mt-3 mt-md-0">
              <div className="position-relative">

                <CIcon
                  icon={cilSearch}
                  className="position-absolute top-50 translate-middle-y ms-3 text-body-secondary"
                />

                <CFormInput
                  placeholder="Search customer or product..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ps-5"
                />

              </div>
            </CCol>

            {/* Rating Filter */}
            <CCol md={3} className="mt-3 mt-md-0">
              <CFormSelect
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="All">
                  All Ratings
                </option>

                <option value="5">
                  5 Stars
                </option>

                <option value="4">
                  4 Stars
                </option>

                <option value="3">
                  3 Stars
                </option>

                <option value="2">
                  2 Stars
                </option>

                <option value="1">
                  1 Star
                </option>
              </CFormSelect>
            </CCol>

          </CRow>
        </CCardHeader>

        <CCardBody className="p-0">

          <div className="table-responsive">

            <CTable hover align="middle" className="mb-0">

              <CTableHead>
                <CTableRow>

                  <CTableHeaderCell className="px-4">
                    Customer
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Product
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Rating
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Review
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Date
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    Status
                  </CTableHeaderCell>

                  <CTableHeaderCell className="text-end px-4">
                    Action
                  </CTableHeaderCell>

                </CTableRow>
              </CTableHead>

              <CTableBody>

                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (

                    <CTableRow key={review.id}>

                      {/* Customer */}
                      <CTableDataCell className="px-4">

                        <div className="fw-semibold">
                          {review.customer}
                        </div>

                        <small className="text-body-secondary">
                          {review.email}
                        </small>

                      </CTableDataCell>

                      {/* Product */}
                      <CTableDataCell>
                        <span className="fw-semibold">
                          {review.product}
                        </span>
                      </CTableDataCell>

                      {/* Rating */}
                      <CTableDataCell>
                        <div>
                          {renderStars(review.rating)}
                        </div>

                        <small className="text-body-secondary">
                          {review.rating}/5
                        </small>
                      </CTableDataCell>

                      {/* Review */}
                      <CTableDataCell>
                        <div
                          style={{
                            maxWidth: "280px",
                            whiteSpace: "normal",
                          }}
                        >
                          {review.review}
                        </div>
                      </CTableDataCell>

                      {/* Date */}
                      <CTableDataCell>
                        {review.date}
                      </CTableDataCell>

                      {/* Status */}
                      <CTableDataCell>
                        <CBadge
                          color={
                            review.status === "Published"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {review.status}
                        </CBadge>
                      </CTableDataCell>

                      {/* Delete */}
                      <CTableDataCell className="text-end px-4">

                        <CButton
                          color="danger"
                          variant="outline"
                          size="sm"
                          title="Delete Review"
                          onClick={() =>
                            handleDelete(review.id)
                          }
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>

                      </CTableDataCell>

                    </CTableRow>

                  ))
                ) : (

                  <CTableRow>
                    <CTableDataCell
                      colSpan={7}
                      className="text-center py-5 text-body-secondary"
                    >
                      No reviews found
                    </CTableDataCell>
                  </CTableRow>

                )}

              </CTableBody>

            </CTable>

          </div>

        </CCardBody>

      </CCard>

    </div>
  );
};

export default ProductReviews;