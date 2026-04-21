import Swal from "sweetalert2";

export const confirmAction = async ({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel",
  icon = "warning",
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
  });

  return result.isConfirmed;
};
