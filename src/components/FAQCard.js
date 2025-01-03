import React from 'react';

const FAQCard = () => {
  return (
    <div
      className="card mt-4"
      style={{
        width: '100%',
      }}
    >
      <div className="card-body">
        <h5 className="card-title text-white mb-4">Q&A</h5>
        <div className="accordion accordion-dark" id="faqAccordion">
          <div className="accordion-item" style={{ backgroundColor: '#454d55', color: '#fff' }}>
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
                style={{
                  backgroundColor: '#2E2E3A',
                  color: '#fff',
                }}
              >
                🤖 Why there is bots in the game?
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#faqAccordion"
              style={{ backgroundColor: '#212529', color: 'white' }}
            >
              <div className="accordion-body">
                🤖 Bots are here to keep games running if there are no players and second task for
                bots is to print money 💸. You can think bots being like Treasury Department 💰.
              </div>
            </div>
          </div>
          <div className="accordion-item" style={{ backgroundColor: '#454d55', color: '#fff' }}>
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
                style={{
                  backgroundColor: '#2E2E3A',
                  color: '#fff',
                }}
              >
                💬 What happens to chat messages and how they are stored?
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#faqAccordion"
              style={{ backgroundColor: '#212529', color: 'white' }}
            >
              <div className="accordion-body">
                💬 Chat messages are currently only hold in memory up to 50 messages.
              </div>
            </div>
          </div>
          <div className="accordion-item" style={{ backgroundColor: '#454d55', color: '#fff' }}>
            <h2 className="accordion-header" id="headingThree">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
                style={{
                  backgroundColor: '#2E2E3A',
                  color: '#fff',
                }}
              >
                ▶️ Can I play as a guest?
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#faqAccordion"
              style={{ backgroundColor: '#212529', color: 'white' }}
            >
              <div className="accordion-body">
                ▶️ Yes, you can play as a guest if you don&#39;t create account or login.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQCard;
