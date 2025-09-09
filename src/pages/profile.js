import { useState, useEffect } from 'react';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { AllouiIcon } from '../components/icons';
import { useRouter } from 'next/router';

function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    experience: '',
    certifications: []
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/api/auth/signin');
    }
    
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        organization: user.organization || '',
        experience: user.experience || '',
        certifications: user.certifications || []
      });
    }
  }, [user, loading, router]);

  const tabs = [
    { id: 'overview', name: 'Overview', iconName: 'user' },
    { id: 'progress', name: 'Progress', iconName: 'target' },
    { id: 'certificates', name: 'Certificates', iconName: 'trophy' },
    { id: 'settings', name: 'Settings', iconName: 'settings' }
  ];

  const mockProgress = {
    completedModules: 8,
    totalModules: 12,
    currentModule: 'Module 9: Game Management',
    overallScore: 85,
    assessmentsPassed: 8,
    lastActivity: '2 hours ago'
  };

  const mockCertificates = [
    {
      id: 1,
      name: 'MABA/NSC Level I Basketball Coaching',
      status: 'In Progress',
      progress: 67,
      expectedCompletion: 'March 15, 2024'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AllouiIcon name="loading" size="lg" animated className="text-alloui-gold mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900">{profileData.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{profileData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{profileData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                  <p className="text-gray-900">{profileData.organization || 'Not provided'}</p>
                </div>
              </div>
              <div className="mt-4">
                <button className="btn btn-outline">Edit Profile</button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-coach-black mb-4">Quick Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-alloui-primary text-white rounded-lg">
                  <div className="text-2xl font-bold">{mockProgress.completedModules}</div>
                  <div className="text-sm text-blue-100">Modules Completed</div>
                </div>
                <div className="text-center p-4 bg-alloui-gold text-black rounded-lg">
                  <div className="text-2xl font-bold">{mockProgress.overallScore}%</div>
                  <div className="text-sm text-orange-100">Average Score</div>
                </div>
                <div className="text-center p-4 bg-green-600 text-white rounded-lg">
                  <div className="text-2xl font-bold">{mockProgress.assessmentsPassed}</div>
                  <div className="text-sm text-green-100">Assessments Passed</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-coach-black mb-4">Certification Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Overall Progress</span>
                  <span>{mockProgress.completedModules}/{mockProgress.totalModules} modules</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-alloui-gold h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(mockProgress.completedModules / mockProgress.totalModules) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-gray-600">
                <strong>Current:</strong> {mockProgress.currentModule}
              </p>
              <p className="text-gray-600">
                <strong>Last Activity:</strong> {mockProgress.lastActivity}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-coach-black mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <AllouiIcon name="success" size="sm" className="text-green-600" />
                  <div>
                    <p className="font-medium">Completed Module 8: Team Strategy</p>
                    <p className="text-sm text-gray-600">Score: 92% • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <AllouiIcon name="resources" size="sm" className="text-blue-600" />
                  <div>
                    <p className="font-medium">Started Module 9: Game Management</p>
                    <p className="text-sm text-gray-600">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <AllouiIcon name="success" size="sm" className="text-green-600" />
                  <div>
                    <p className="font-medium">Completed Assessment: Offensive Systems</p>
                    <p className="text-sm text-gray-600">Score: 88% • 3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'certificates':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-coach-black mb-4">My Certifications</h3>
              <div className="space-y-4">
                {mockCertificates.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold">{cert.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cert.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cert.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{cert.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-basketball-orange h-2 rounded-full"
                          style={{ width: `${cert.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Expected completion: {cert.expectedCompletion}
                    </p>
                    <div className="mt-3">
                      <button className="btn btn-outline btn-sm">
                        {cert.status === 'Completed' ? 'Download Certificate' : 'Continue Learning'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-coach-black mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-basketball-orange focus:ring-basketball-orange" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Email notifications for module updates</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-basketball-orange focus:ring-basketball-orange" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Email reminders for incomplete assessments</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-basketball-orange focus:ring-basketball-orange" />
                    <span className="ml-2 text-sm text-gray-700">SMS notifications for important updates</span>
                  </label>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-coach-black mb-3">Account Actions</h4>
                <div className="space-y-2">
                  <button className="btn btn-outline">Change Password</button>
                  <button className="btn btn-outline">Download My Data</button>
                  <button className="btn text-red-600 border-red-300 hover:bg-red-50">Delete Account</button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>My Profile | alloui by CBL</title>
        <meta name="description" content="Manage your basketball coaching certification profile and track your progress with alloui by CBL." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="My Profile | alloui by CBL" />
        <meta property="og:description" content="Manage your basketball coaching certification profile and track your progress with alloui by CBL." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="My Profile - alloui by CBL coaching certification" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My Profile | alloui by CBL" />
        <meta name="twitter:description" content="Manage your basketball coaching certification profile and track your progress with alloui by CBL." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="profile, user account, coaching progress, basketball certification, MABA profile, NSC Level I progress, Malaysia basketball" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="noindex, follow" />
        <meta name="language" content="en-US" />
        <meta name="geo.region" content="MY" />
        <meta name="geo.country" content="Malaysia" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-alloui-primary text-white rounded-lg p-8 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-alloui-gold text-black rounded-full flex items-center justify-center text-2xl font-bold">
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profileData.name || 'User Profile'}</h1>
                <p className="text-blue-100">{profileData.email}</p>
                <p className="text-blue-100">Member since: {new Date().getFullYear()}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    activeTab === tab.id
                      ? 'bg-basketball-orange text-white border-basketball-orange'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-basketball-orange'
                  }`}
                >
                  <AllouiIcon name={tab.iconName} size="sm" className="mr-2" />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
    </>
  );
}

Profile.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export default Profile;