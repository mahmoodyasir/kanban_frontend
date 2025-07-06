import { url } from "../config";

export const getAllProduct = async (skip: number, limit: number, category: string, searchTerm: string, allRecord: boolean,
  handleSuccess: (data?: any) => void,
  handleError: (err?: any) => void
) => {
  try {
    const response = await fetch(`${url}/api/product?page=${skip}&limit=${limit}&category=${category}&searchTerm=${searchTerm}&allRecord=${allRecord}`, {
      method: 'GET',
      headers: {

      },

    });

    const jsonData = await response.json();

    if (response.status === 200) handleSuccess(jsonData);
    else handleError(jsonData);

  } catch (err) {
    handleError(err);
  }
}



export const insertProduct = async (body: any, handleSuccess: (data?: any) => void, handleError: (err?: any) => void) => {
  try {
    const response = await fetch(`${url}/api/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const jsonData = await response.json();

    if (response.status === 201) handleSuccess(jsonData);
    else handleError(jsonData);
  } catch (err) {
    handleError(err);
  }
}


export const updateProductCategory = async (id: string, body: any, handleSuccess: (data?: any) => void, handleError: (err?: any) => void) => {
  try {
    const response = await fetch(`${url}/api/product/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const jsonData = await response.json();

    if (response.status === 201) handleSuccess(jsonData);
    else handleError(jsonData);
  } catch (err) {
    handleError(err);
  }
}
