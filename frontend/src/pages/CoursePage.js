import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import DocumentViewer from "./DocumentViewer";

export default function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [videos, setVideos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const nav = useNavigate();

  // Load course + enrollment status
  useEffect(() => {
    API.get(`/courses/${id}`).then((res) => {
      setCourse(res.data.course);
      setIsEnrolled(res.data.isEnrolled); 
    });

    API.get(`/docs/course/${id}`).then((res) => setDocuments(res.data));
  }, [id]);

  // Payment function
  const startPayment = async () => {
    try {
      if (!user || !user._id) {
        alert("Please login first");
        return;
      }

      const orderRes = await API.post("/payment/create-order", {
        courseId: id,
        userId: user._id,
      });

      const order = orderRes.data;

      const options = {
        key: "rzp_test_RkDk1rZCKIh5cf",
        amount: order.amount,
        currency: order.currency,
        name: "Imarticus LMS",
        description: `Payment for course: ${course.title}`,
        order_id: order.orderId,

        handler: async function (response) {
          console.log("PAYMENT RESPONSE:", response);
          await API.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId: id,
            userId: user._id,
          });

          alert("Payment Successful!");
          handleEnroll();
        },

        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      alert("Payment failed");
    }
  };

  // Enroll user after successful payment
  const handleEnroll = async () => {
    await API.post(`/courses/${id}/enroll`);
    setIsEnrolled(true);

    const sec = await API.get(`/courses/${id}/sections`);
    setSections(sec.data);
  };

  const loadVideos = async (sectionId) => {
    const res = await API.get(`/courses/section/${sectionId}/videos`);
    setVideos(res.data);
  };

  return (
    <div className="container mt-4">
      {!course ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          {!isEnrolled && (
            <button className="btn btn-primary mb-3" onClick={startPayment}>
              Buy Course ₹500
            </button>
          )}

          {/* IF enrolled, show content */}
          <div className="row">
            <div className="col-md-4">
              <h5>Sections</h5>
              <ul className="list-group">
                {sections.map((s) => (
                  <li key={s._id} className="list-group-item">
                    <button className="btn btn-link p-0" onClick={() => loadVideos(s._id)}>
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Upload Docs */}
              {isEnrolled && (
                <>
                  <h5 className="mt-4">Upload Document</h5>
                  <input
                    type="file"
                    className="form-control mb-2"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const form = new FormData();
                      form.append("document", file);

                      try {
                        await API.post(`/docs/upload/${id}`, form, {
                          headers: { "Content-Type": "multipart/form-data" },
                        });

                        const docs = await API.get(`/docs/course/${id}`);
                        setDocuments(docs.data);
                      } catch (err) {
                        console.error("UPLOAD ERROR:", err);
                        alert("Failed to upload document");
                      }
                    }}
                  />
                </>
              )}

              <h5 className="mt-4">Documents</h5>
              <ul className="list-group">
                {documents.map((d) => (
                  <li
                    key={d._id}
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedDoc(d)}
                  >
                    📄 {d.title}
                  </li>
                ))}
              </ul>

              <h6 className="mt-3">Videos</h6>
              <ul className="list-group">
                {videos.map((v) => (
                  <li
                    key={v._id}
                    className="list-group-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => nav(`/video/${v._id}`)}
                  >
                    🎬 {v.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT: Document Viewer */}
            <div className="col-md-8">
              {selectedDoc ? (
                <DocumentViewer doc={selectedDoc} />
              ) : (
                <p>Select a video or document to open.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
