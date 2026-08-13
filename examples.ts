import axios from "axios"
import toast from "react-hot-toast"

//ejemplo de peticion api con AXIOS
async function fetchProducts() {
  try {
    const response = await axios.get("/api/products")

  } catch (e: any) {
    if (e.response && e.response.data && e.response.data.message) {
      toast.error(e.response.data.message)
    } else {
      toast.error(e.message)
    }
  }
}