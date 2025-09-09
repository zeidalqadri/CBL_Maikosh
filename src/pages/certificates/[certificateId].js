import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MainLayout from '../../layouts/MainLayout';
import CertificateGenerator from '../../lib/certificates/generator';
import { AllouiIcon } from '../../components/icons';

export default function CertificateView() {
  const router = useRouter();
  const { certificateId } = router.query;
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (certificateId) {
      verifyCertificate();
    }
  }, [certificateId]);

  const verifyCertificate = async () => {
    try {
      const response = await fetch(`/api/certificates/verify/${certificateId}`);
      const data = await response.json();
      
      if (data.valid) {
        setCertificate(data.certificate);
      } else {
        setError(data.message || 'Invalid certificate');
      }
    } catch (err) {
      setError('Failed to verify certificate');
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async () => {
    if (!certificate) return;

    try {
      // Generate PDF for download
      const generator = new CertificateGenerator();
      const certData = await generator.generateCertificate({
        name: certificate.holderName,
        email: 'verified@cbl-maikosh.com',
        userId: certificateId
      });
      
      // Convert data URL to blob and download
      const pdfData = certData.pdfData.split(',')[1];
      const byteCharacters = atob(pdfData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CBL_Maikosh_Certificate_${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  const shareOnLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-alloui-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying certificate...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Head>
          <title>Certificate Not Found | alloui by CBL</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <AllouiIcon name="error" size="xl" variant="danger" className="mb-1rem mx-auto" />
            <h1 className="text-2xl font-bold text-red-600 mb-4">Certificate Verification Failed</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-alloui-gold text-black rounded-lg hover:opacity-90 transition-all"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>Certificate Verification | alloui by CBL</title>
        <meta name="description" content={`Verify Basketball Coaching Level I certificate for ${certificate?.holderName}`} />
      </Head>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Verification Success Banner */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AllouiIcon name="success" size="lg" variant="success" className="mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-green-800">Valid Certificate</h2>
                <p className="text-green-600">This is a verified CBL_Maikosh certificate</p>
              </div>
            </div>
          </div>

          {/* Certificate Display */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <AllouiIcon name="trophy" size="xl" variant="gold" className="mb-1rem mx-auto" />
              <h1 className="text-3xl font-bold text-alloui-primary mb-2">Certificate of Completion</h1>
              <p className="text-xl text-alloui-gold">Basketball Coaching Level I</p>
            </div>

            <div className="border-t border-b border-gray-200 py-6 my-6">
              <div className="text-center">
                <p className="text-gray-600 mb-2">This certifies that</p>
                <h2 className="text-2xl font-bold text-alloui-primary mb-2">{certificate.holderName}</h2>
                <p className="text-gray-600">has successfully completed all requirements</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Certificate ID</p>
                <p className="font-mono text-sm">{certificate.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Completion Date</p>
                <p className="font-semibold">{certificate.completionDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Modules Completed</p>
                <p className="font-semibold">{certificate.modulesCompleted} of 12</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Issue Date</p>
                <p className="font-semibold">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Verification Hash */}
            <div className="bg-gray-50 rounded p-4 mb-6">
              <p className="text-xs text-gray-500 mb-1">Verification Hash</p>
              <p className="font-mono text-xs break-all">{certificate.verificationHash}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={downloadCertificate}
                className="px-6 py-3 bg-alloui-gold text-black rounded-lg hover:opacity-90 transition-all inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>

              <button
                onClick={shareOnLinkedIn}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                Share on LinkedIn
              </button>

              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>

          {/* Verification Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Verification Information</h3>
            <p className="text-blue-800 mb-2">
              This certificate can be independently verified using the certificate ID above.
            </p>
            <p className="text-blue-800">
              To verify this certificate, visit: 
              <code className="ml-2 px-2 py-1 bg-white rounded text-sm">
                https://cbl-maikosh.com/certificates/{certificateId}
              </code>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}