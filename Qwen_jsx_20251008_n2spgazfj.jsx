import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Shield, BarChart3, FileText, Bell, Users, Package, DollarSign, AlertTriangle, Plus, Upload, LogIn, LogOut, Settings, Eye, Edit, Trash2, X } from 'lucide-react';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(12847.50);
  const [dailySales, setDailySales] = useState(342);
  const [weeklyRevenue, setWeeklyRevenue] = useState(8923.75);
  const [monthlyRevenue, setMonthlyRevenue] = useState(28456.20);
  const [todayRevenue, setTodayRevenue] = useState(1247.80);
  
  const [products, setProducts] = useState([
    { id: 1, name: 'Canva Pro License', sales: 127, category: 'Design Tools', price: 29.99, image: 'https://placehold.co/300x200/3b82f6/ffffff?text=Canva+Pro' },
    { id: 2, name: 'Spotify Premium Gift Card', sales: 98, category: 'Streaming', price: 14.99, image: 'https://placehold.co/300x200/10b981/ffffff?text=Spotify' },
    { id: 3, name: 'Figma Template Bundle', sales: 84, category: 'Design Tools', price: 45.00, image: 'https://placehold.co/300x200/8b5cf6/ffffff?text=Figma' },
    { id: 4, name: 'Notion Template Pack', sales: 76, category: 'Productivity', price: 24.99, image: 'https://placehold.co/300x200/f59e0b/ffffff?text=Notion' },
    { id: 5, name: 'Adobe Creative Cloud', sales: 65, category: 'Creative Software', price: 52.99, image: 'https://placehold.co/300x200/ef4444/ffffff?text=Adobe' },
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, product: 'Canva Pro License', amount: 29.99, time: '10:23 AM', status: 'completed' },
    { id: 2, product: 'Spotify Premium Gift Card', amount: 14.99, time: '09:45 AM', status: 'completed' },
    { id: 3, product: 'Figma Design Template Pack', amount: 45.00, time: '08:32 AM', status: 'completed' },
    { id: 4, product: 'Adobe Creative Cloud License', amount: 52.99, time: '07:15 AM', status: 'completed' },
    { id: 5, product: 'Netflix Premium Account', amount: 19.99, time: '06:45 AM', status: 'cancelled' },
  ]);

  // Admin form states
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    image: ''
  });
  const [newTransaction, setNewTransaction] = useState({
    product: '',
    amount: '',
    time: ''
  });
  
  // Edit states
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'binnprst1123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('Password admin salah!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.category && newProduct.price) {
      const product = {
        id: products.length + 1,
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        sales: 0,
        image: newProduct.image || 'https://placehold.co/300x200/6b7280/ffffff?text=No+Image'
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', category: '', price: '', image: '' });
    }
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (editingProduct && editingProduct.name && editingProduct.category && editingProduct.price) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...editingProduct, price: parseFloat(editingProduct.price) }
          : p
      ));
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (newTransaction.product && newTransaction.amount) {
      const transaction = {
        id: transactions.length + 1,
        product: newTransaction.product,
        amount: parseFloat(newTransaction.amount),
        time: newTransaction.time || formatTime(currentTime),
        status: 'completed'
      };
      setTransactions([transaction, ...transactions]);
      
      // Update revenue and sales
      setTotalRevenue(prev => prev + transaction.amount);
      setTodayRevenue(prev => prev + transaction.amount);
      setDailySales(prev => prev + 1);
      
      setNewTransaction({ product: '', amount: '', time: '' });
    }
  };

  const handleUpdateTransaction = (e) => {
    e.preventDefault();
    if (editingTransaction && editingTransaction.product && editingTransaction.amount) {
      const oldTransaction = transactions.find(t => t.id === editingTransaction.id);
      const amountDifference = editingTransaction.amount - oldTransaction.amount;
      
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id 
          ? { ...editingTransaction, amount: parseFloat(editingTransaction.amount) }
          : t
      ));
      
      // Update revenue based on difference
      setTotalRevenue(prev => prev + amountDifference);
      if (oldTransaction.status === 'completed' && editingTransaction.status === 'completed') {
        setTodayRevenue(prev => prev + amountDifference);
      }
      
      setEditingTransaction(null);
    }
  };

  const handleCancelTransaction = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction && transaction.status === 'completed') {
      if (window.confirm('Apakah Anda yakin ingin membatalkan transaksi ini? Ini akan mengurangi pendapatan.')) {
        setTransactions(transactions.map(t => 
          t.id === transactionId ? { ...t, status: 'cancelled' } : t
        ));
        setTotalRevenue(prev => prev - transaction.amount);
        setTodayRevenue(prev => prev - transaction.amount);
        setDailySales(prev => prev - 1);
      }
    }
  };

  const handleDeleteTransaction = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini secara permanen?')) {
      setTransactions(transactions.filter(t => t.id !== transactionId));
      if (transaction.status === 'completed') {
        setTotalRevenue(prev => prev - transaction.amount);
        setTodayRevenue(prev => prev - transaction.amount);
        setDailySales(prev => prev - 1);
      }
    }
  };

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Sort products by sales (best selling first)
  const bestSellingProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AkunBayar</h1>
                <p className="text-sm text-gray-600">Pasar Digital Aman untuk Akun Premium</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-mono text-lg font-semibold text-gray-900">
                  {formatTime(currentTime)}
                </span>
              </div>
              {isAdmin ? (
                <button 
                  onClick={handleAdminLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout Admin</span>
                </button>
              ) : (
                <button 
                  onClick={() => setShowAdminLogin(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Login Admin</h3>
            <form onSubmit={handleAdminLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Admin</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan password admin"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Dashboard (Only visible when logged in) */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Panel Admin</h3>
            
            {/* Financial Management */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Kelola Keuangan</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Pendapatan</label>
                  <input
                    type="number"
                    value={totalRevenue}
                    onChange={(e) => setTotalRevenue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pendapatan Hari Ini</label>
                  <input
                    type="number"
                    value={todayRevenue}
                    onChange={(e) => setTodayRevenue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penjualan Hari Ini</label>
                  <input
                    type="number"
                    value={dailySales}
                    onChange={(e) => setDailySales(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pendapatan Mingguan</label>
                  <input
                    type="number"
                    value={weeklyRevenue}
                    onChange={(e) => setWeeklyRevenue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Add Transaction Form */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Tambah Transaksi Baru</h4>
              <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newTransaction.product}
                  onChange={(e) => setNewTransaction({...newTransaction, product: e.target.value})}
                  placeholder="Nama Produk"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  placeholder="Jumlah (Rp)"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Product Management */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h4>
              <form 
                onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} 
                className="space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editingProduct ? editingProduct.name : newProduct.name}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({...editingProduct, name: e.target.value})
                      : setNewProduct({...newProduct, name: e.target.value})
                    }
                    placeholder="Nama Produk"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    value={editingProduct ? editingProduct.category : newProduct.category}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({...editingProduct, category: e.target.value})
                      : setNewProduct({...newProduct, category: e.target.value})
                    }
                    placeholder="Kategori"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={editingProduct ? editingProduct.price : newProduct.price}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({...editingProduct, price: e.target.value})
                      : setNewProduct({...newProduct, price: e.target.value})
                    }
                    placeholder="Harga (Rp)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (image) => 
                        editingProduct 
                          ? setEditingProduct({...editingProduct, image})
                          : setNewProduct({...newProduct, image})
                      )}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {(editingProduct?.image || newProduct.image) && (
                      <img 
                        src={editingProduct?.image || newProduct.image} 
                        alt="Preview" 
                        className="w-12 h-12 object-cover rounded" 
                      />
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{editingProduct ? 'Update Produk' : 'Tambah Produk'}</span>
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Products List for Editing/Deleting */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Kelola Produk</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {products.map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">Rp{product.price.toLocaleString()} • {product.sales} terjual</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions Management */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Kelola Transaksi</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.product}</p>
                      <p className="text-sm text-gray-600">
                        Rp{transaction.amount.toLocaleString()} • {transaction.time}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {transaction.status === 'completed' && (
                        <button
                          onClick={() => handleCancelTransaction(transaction.id)}
                          className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
                          title="Batalkan"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingTransaction(transaction)}
                        className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Kelola dan pantau pemasukan penjualan akun premium secara real-time.
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Platform marketplace aman dan transparan untuk produk digital legal dengan analitik cerdas dan pelacakan pendapatan real-time.
          </p>
        </div>
      </section>

      {/* Legal Warning Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              <strong>Peringatan Hukum:</strong> AkunBayar hanya mengizinkan penjualan produk digital legal seperti gift card resmi, lisensi software, dan konten digital orisinal. Penjualan akun yang melanggar Terms of Service dilarang.
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Penjual</h3>
            <p className="text-gray-600">Pantau kinerja bisnis digital Anda secara real-time</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pendapatan</p>
                  <p className="text-2xl font-bold text-gray-900">Rp{totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Penjualan Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{dailySales}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendapatan Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">Rp{todayRevenue.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendapatan Mingguan</p>
                  <p className="text-2xl font-bold text-gray-900">Rp{weeklyRevenue.toLocaleString()}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendapatan Bulanan</p>
                  <p className="text-2xl font-bold text-gray-900">Rp{monthlyRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-pink-500" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-5 w-5 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">Produk Tersedia</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-1">{product.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">Rp{product.price.toLocaleString()}</span>
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {product.sales} terjual
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Best Selling Products */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-900">Produk Terlaris</h4>
              </div>
              <div className="space-y-3">
                {bestSellingProducts.map((product, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {product.sales} terjual
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-green-600" />
                <h4 className="text-lg font-semibold text-gray-900">Transaksi Terbaru</h4>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.product}</p>
                      <p className="text-sm text-gray-500">{transaction.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">Rp{transaction.amount.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Trends */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <h4 className="text-lg font-semibold text-gray-900">Tren Pasar Digital 2025</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">Produk Digital Legal</h5>
                <p className="text-sm text-blue-800">Lisensi software, gift card resmi, dan konten digital orisinal menjadi pilihan utama konsumen.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-900 mb-2">E-Learning & Kursus</h5>
                <p className="text-sm text-green-800">Permintaan tinggi untuk kursus online, template pembelajaran, dan sertifikasi digital.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-semibold text-purple-900 mb-2">AI Tools & Plugin</h5>
                <p className="text-sm text-purple-800">Tools berbasis AI dan plugin kreatif menjadi tren utama di kalangan profesional digital.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">AkunBayar</h3>
              </div>
              <p className="text-gray-400">
                Platform marketplace aman dan transparan untuk produk digital legal dengan fokus pada keamanan dan analitik cerdas.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Fitur Utama</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Dashboard Real-Time</li>
                <li>Analitik Produk Terlaris</li>
                <li>Verifikasi Penjual</li>
                <li>Laporan Transaksi Otomatis</li>
                <li>Edukasi Hukum Digital</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Produk Legal yang Didukung</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Gift Card Resmi</li>
                <li>Lisensi Software Legal</li>
                <li>eBook & Kursus Online</li>
                <li>Template & Desain</li>
                <li>Plugin & AI Tools</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AkunBayar. Semua transaksi harus mematuhi hukum dan Terms of Service penyedia layanan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;