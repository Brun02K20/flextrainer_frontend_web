import React from 'react'
import { Pagination } from 'react-bootstrap'

const Paginator = ({
  currentPage,
  totalPages,
  handlePageChange
}) => {
  return (
    <Pagination>
      <Pagination.Prev
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {[...Array(totalPages)].map((_, index) => (
        <Pagination.Item
          key={index + 1}
          active={index + 1 === currentPage}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  )
}

export { Paginator }
