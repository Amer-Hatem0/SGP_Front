import React from 'react';

const MapPage = () => {
  return (
    <div>
      <h2 className="text-center my-4">  </h2>
      <div style={{ width: '100%', height: '400px' }}>
        <iframe
          title="Google Map of Palestine"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3367.912524261297!2d35.20339061505762!3d31.90349028132512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502d7b1a0d1e111%3A0x7cda11a856ba39a0!2z2KXYqNixINin2YTYp9mGINio2YrZhdmK2YUg2KfZhNin2LHYqSDZhdit2KfYsdmE2Kkg2KfZhNin2LHYqQ!5e0!3m2!1sar!2sil!4v1718275200000!5m2!1sar!2sil"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default MapPage;