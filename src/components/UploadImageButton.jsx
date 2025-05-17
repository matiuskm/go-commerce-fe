import { useContext, useRef } from "react"
import BASE_URL from "../api/config"
import { AuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"

function UploadImageButton({ productId, onUploaded }) {
    const { user } = useContext(AuthContext)
  const inputRef = useRef()

  const handleChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch(`${BASE_URL}/admin/products/${productId}/image`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      })

      if (res.ok) {
        const prodRes = await fetch(`${BASE_URL}/admin/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${user.token}`, }
          }
        )
        const { product: updatedProduct } = await prodRes.json()
        onUploaded?.(updatedProduct)
      } else {
        toast.error("Failed to upload image")
      }
    } catch (err) {
      console.error(err)
      toast.error("Upload error")
    }
  }

  return (
    <>
      <button
        onClick={() => inputRef.current.click()}
        className="text-sm text-blue-600 underline"
      >
        Add Image
      </button>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
    </>
  )
}

export default UploadImageButton
