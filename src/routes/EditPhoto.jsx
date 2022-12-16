import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditPhoto = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [captions, setCaptions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  async function getData(){
    const response = await fetch(`https://gallery-app-server.vercel.app/photos/${id}`)
    const data = await response.json()

    setImageUrl(data.imageUrl)
    setCaptions(data.captions)
  }

  const editData = async () => {
    try{
      const response = await fetch(`https://gallery-app-server.vercel.app/photos/${id}`, {
        method: "PATCH",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          "imageUrl":imageUrl,
          "captions":captions,
          "updatedAt": new Date(),
        }) 
      })
      
      if(response.status == 403){
        console.log("masuk eror")
        const data = await response.json()
        console.log(data)
        throw Error(data.error)
      }
      navigate("/photos")
      return response.json()
    }
    catch (error){
      setError(error.message)
    }
  }

  const editPhoto = (e) => {
    e.preventDefault();
    editData()
    
  }

  useEffect(() => {
    setLoading(true);
    getData()
    setLoading(false)

  }, [id]);

  if (error) return <div>Error!</div>;

  return (
    <>
      {loading ? (
        <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
          Loading...
        </h1>
      ) : (
        <div className="container">
          <form className="edit-form" onSubmit={editPhoto}>
            <label>
              Image Url:
              <input
                className="edit-input"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </label>
            <label>
              Captions:
              <input
                className="edit-input"
                type="text"
                value={captions}
                data-testid="captions"
                onChange={(e) => setCaptions(e.target.value)}
              />
            </label>
            <input className="submit-btn" type="submit" value="Submit" data-testid="submit" />
          </form>
        </div>
      )}
    </>
  );
};

export default EditPhoto;
