import React from "react";
import "./DataTable.css";

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No records found.",
  actions,
}) => {
  if (loading) {
    return (
      <div className="datatable-loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="datatable-wrapper">
      <table className="datatable">

        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.accessor}>
                {column.header}
              </th>
            ))}

            {actions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>

          {data.length === 0 ? (
            <tr>
              <td
                colSpan={
                  actions
                    ? columns.length + 1
                    : columns.length
                }
                className="datatable-empty"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id || index}>

                {columns.map((column) => (
                  <td key={column.accessor}>
                    {column.render
                      ? column.render(row)
                      : row[column.accessor]}
                  </td>
                ))}

                {actions && (
                  <td className="datatable-actions">
                    {actions(row)}
                  </td>
                )}

              </tr>
            ))
          )}

        </tbody>

      </table>
    </div>
  );
};

export default DataTable;
