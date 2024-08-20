document.addEventListener("DOMContentLoaded", function () {
    var table = new Tabulator("#tblTable", {
        layout: "fitColumns", // Distribute columns evenly across the table
        responsiveLayout: "collapse", // Collapse columns that don't fit
        ajaxURL: "https://localhost:7203/Admin/Product/GetAll", // API endpoint for data
        ajaxResponse: function (url, params, response) {
            console.log(response);
            return response.data; // Map the JSON data to what Tabulator expects
        },
        pagination: "local", // Enable pagination
        paginationSize: 10, // Number of rows per page
        movableColumns: true, // Allow columns to be moved
        tooltips: true, // Show tooltips on cells
        columns: [
            { title: 'Title', field: 'title', width: 200, tooltip: "The title of the product" },
            { title: 'ISBN', field: 'isbn', width: 150, tooltip: "The ISBN of the product" },
            { title: 'Price', field: 'listPrice', width: 150, tooltip: "The price of the product" },
            { title: 'Author', field: 'author', width: 200, tooltip: "The author of the product" },
            { title: 'Category', field: 'category.name', width: 200, tooltip: "The category of the product" },
            {
                title: "Actions",
                field: "actions",
                width: 100,
                formatter: function (cell, formatterParams, onRendered) {
                    return `
                        <div class="action-buttons">
                            <button class="btn btn-primary btn-sm edit-btn" data-id="${cell.getRow().getData().id}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${cell.getRow().getData().id}">Delete</button>
                        </div>
                    `;
                },
                cellClick: function (e, cell) {
                    var action = e.target.classList.contains('edit-btn') ? 'edit' : 'delete';
                    var id = e.target.getAttribute('data-id');
                    if (action === 'edit') {
                        handleEdit(id);
                    } else if (action === 'delete') {
                        handleDelete(id);
                    }
                }
            }
        ],
        rowClick: function (e, row) {
            alert("You clicked on " + row.getData().title);
        }
    });

    // Search functionality
    document.getElementById("searchInput").addEventListener("keyup", function () {
        var searchTerm = this.value;
        table.setFilter(function (data, filterParams) {
            return Object.values(data).some(value =>
                value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    });

    // Edit handler
    function handleEdit(id) {
        window.location.href = `https://localhost:7203/Admin/Product/Upsert?id=${id}`;
    }

    // Delete handler
    function handleDelete(id) {
        var url = `https://localhost:7203/Admin/Product/Delete?id=${id}`;
        Delete(url); // Use the SweetAlert confirmation before deleting
    }

    // SweetAlert Delete confirmation
    function Delete(url) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'DELETE',
                    url: url,
                    success: function (data) {
                        if (data.success) {
                            table.replaceData(); // Refresh the table data after delete
                            Swal.fire("Deleted!", data.message, "success");
                        } else {
                            Swal.fire("Error!", data.message, "error");
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('Error:', error);
                        Swal.fire("Error!", "An error occurred while deleting the item.", "error");
                    }
                });
            }
        });
    }
});
