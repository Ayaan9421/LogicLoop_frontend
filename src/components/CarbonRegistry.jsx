import React, { useState, useMemo } from 'react';
import { 
  Database,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Trees,
  MapPin,
  Calendar,
  TrendingUp,
  Leaf,
  BarChart3,
  Download,
  Search,
  Filter
} from 'lucide-react';
import './CarbonRegistry.css';

const CarbonSinkRegistry = () => {
  const [sinkData, setSinkData] = useState([
    {
      id: 1,
      name: 'North Boundary Plantation',
      type: 'afforestation',
      area: 45.5,
      plantationDate: '2020-03-15',
      species: 'Mixed Native',
      treeCount: 5000,
      growthRate: 0.12,
      location: 'Sector A',
      status: 'mature'
    },
    {
      id: 2,
      name: 'Eastern Greenbelt',
      type: 'greenbelt',
      area: 28.3,
      plantationDate: '2021-07-22',
      species: 'Eucalyptus',
      treeCount: 3200,
      growthRate: 0.15,
      location: 'Sector B',
      status: 'growing'
    },
    {
      id: 3,
      name: 'South Perimeter Zone',
      type: 'afforestation',
      area: 62.8,
      plantationDate: '2019-11-10',
      species: 'Bamboo',
      treeCount: 8500,
      growthRate: 0.18,
      location: 'Sector C',
      status: 'mature'
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    type: 'afforestation',
    area: '',
    plantationDate: '',
    species: '',
    treeCount: '',
    growthRate: '',
    location: '',
    status: 'growing'
  });

  const speciesPresets = [
    { name: 'Mixed Native', growthRate: 0.12 },
    { name: 'Eucalyptus', growthRate: 0.15 },
    { name: 'Bamboo', growthRate: 0.18 },
    { name: 'Teak', growthRate: 0.10 },
    { name: 'Neem', growthRate: 0.13 },
    { name: 'Sal', growthRate: 0.11 },
    { name: 'Mango', growthRate: 0.09 },
    { name: 'Custom', growthRate: 0.12 }
  ];

  const calculateAge = (plantationDate) => {
    const planted = new Date(plantationDate);
    const now = new Date();
    const years = (now - planted) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, years);
  };

  const calculateSequestration = (sink) => {
    const age = calculateAge(sink.plantationDate);
    const baseSequestration = 5.5; // tCO2e per tree per year at maturity
    const ageFactor = Math.min(age / 10, 1); // Trees reach full capacity in 10 years
    const growthFactor = 1 + sink.growthRate;
    const annualSequestration = sink.treeCount * baseSequestration * ageFactor * growthFactor;
    return annualSequestration;
  };

  const totalSequestration = useMemo(() => {
    return sinkData.reduce((total, sink) => total + calculateSequestration(sink), 0);
  }, [sinkData]);

  const totalArea = useMemo(() => {
    return sinkData.reduce((total, sink) => total + parseFloat(sink.area), 0);
  }, [sinkData]);

  const totalTrees = useMemo(() => {
    return sinkData.reduce((total, sink) => total + parseInt(sink.treeCount), 0);
  }, [sinkData]);

  const filteredData = useMemo(() => {
    return sinkData.filter(sink => {
      const matchesSearch = sink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sink.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || sink.type === filterType;
      const matchesStatus = filterStatus === 'all' || sink.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [sinkData, searchTerm, filterType, filterStatus]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpeciesChange = (species) => {
    const preset = speciesPresets.find(s => s.name === species);
    setFormData(prev => ({
      ...prev,
      species: species,
      growthRate: preset ? preset.growthRate : prev.growthRate
    }));
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({
      name: '',
      type: 'afforestation',
      area: '',
      plantationDate: '',
      species: '',
      treeCount: '',
      growthRate: '',
      location: '',
      status: 'growing'
    });
  };

  const handleEdit = (sink) => {
    setEditingId(sink.id);
    setIsAddingNew(false);
    setFormData({
      name: sink.name,
      type: sink.type,
      area: sink.area,
      plantationDate: sink.plantationDate,
      species: sink.species,
      treeCount: sink.treeCount,
      growthRate: sink.growthRate,
      location: sink.location,
      status: sink.status
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.area || !formData.plantationDate || !formData.species) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      setSinkData(prev => prev.map(sink => 
        sink.id === editingId ? { ...formData, id: editingId } : sink
      ));
    } else {
      const newSink = {
        ...formData,
        id: Math.max(...sinkData.map(s => s.id), 0) + 1,
        area: parseFloat(formData.area),
        treeCount: parseInt(formData.treeCount),
        growthRate: parseFloat(formData.growthRate)
      };
      setSinkData(prev => [...prev, newSink]);
    }

    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this carbon sink entry?')) {
      setSinkData(prev => prev.filter(sink => sink.id !== id));
    }
  };

  const exportData = () => {
    const csv = [
      ['Name', 'Type', 'Area (ha)', 'Plantation Date', 'Species', 'Tree Count', 'Growth Rate', 'Location', 'Status', 'Annual Sequestration (tCO2e)'],
      ...sinkData.map(sink => [
        sink.name,
        sink.type,
        sink.area,
        sink.plantationDate,
        sink.species,
        sink.treeCount,
        sink.growthRate,
        sink.location,
        sink.status,
        calculateSequestration(sink).toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbon-sink-registry-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  return (
    <div className="registry-container">
      <div className="page-header">
        <div>
          <h1>
            <Database size={32} color="#10b981" />
            Carbon Sink Data Registry
          </h1>
          <p>Track and manage afforestation and greenbelt areas to monitor carbon sequestration performance.</p>
        </div>
        <button className="btn-primary" onClick={handleAddNew}>
          <Plus size={20} />
          Add New Carbon Sink
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card primary">
          <div className="summary-icon">
            <TrendingUp size={28} color="#10b981" />
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Annual Sequestration</div>
            <div className="summary-value">
              {formatNumber(totalSequestration)}
              <span className="summary-unit">tCO2e/year</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <MapPin size={28} color="#64748b" />
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Area Coverage</div>
            <div className="summary-value">
              {totalArea.toFixed(2)}
              <span className="summary-unit">hectares</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Trees size={28} color="#64748b" />
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Trees Planted</div>
            <div className="summary-value">
              {formatNumber(totalTrees)}
              <span className="summary-unit">trees</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Database size={28} color="#64748b" />
          </div>
          <div className="summary-content">
            <div className="summary-label">Registered Zones</div>
            <div className="summary-value">
              {sinkData.length}
              <span className="summary-unit">sites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="data-section">
        <div className="data-header">
          <div className="search-filter-row">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <Filter size={18} />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="afforestation">Afforestation</option>
                <option value="greenbelt">Greenbelt</option>
              </select>

              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="growing">Growing</option>
                <option value="mature">Mature</option>
                <option value="monitoring">Monitoring</option>
              </select>
            </div>

            <button className="btn-export" onClick={exportData}>
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(isAddingNew || editingId) && (
          <div className="form-card">
            <div className="form-header">
              <h3>{editingId ? 'Edit Carbon Sink' : 'Add New Carbon Sink'}</h3>
              <button className="btn-icon" onClick={handleCancel}>
                <X size={20} />
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  placeholder="e.g., North Boundary Plantation"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  <option value="afforestation">Afforestation</option>
                  <option value="greenbelt">Greenbelt</option>
                </select>
              </div>

              <div className="form-group">
                <label>Area (hectares) *</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Plantation Date *</label>
                <input
                  type="date"
                  value={formData.plantationDate}
                  onChange={(e) => handleInputChange('plantationDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Species *</label>
                <select
                  value={formData.species}
                  onChange={(e) => handleSpeciesChange(e.target.value)}
                >
                  <option value="">Select species...</option>
                  {speciesPresets.map(sp => (
                    <option key={sp.name} value={sp.name}>{sp.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tree Count *</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.treeCount}
                  onChange={(e) => handleInputChange('treeCount', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Growth Rate (multiplier) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.12"
                  value={formData.growthRate}
                  onChange={(e) => handleInputChange('growthRate', e.target.value)}
                />
                <span className="form-hint">Default based on species selection</span>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  placeholder="e.g., Sector A"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="growing">Growing</option>
                  <option value="mature">Mature</option>
                  <option value="monitoring">Monitoring</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-secondary" onClick={handleCancel}>
                <X size={18} />
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                <Save size={18} />
                {editingId ? 'Update' : 'Save'} Carbon Sink
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Area (ha)</th>
                <th>Planted</th>
                <th>Age</th>
                <th>Species</th>
                <th>Trees</th>
                <th>Growth Rate</th>
                <th>Location</th>
                <th>Status</th>
                <th>Annual Sequestration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="12" className="no-data">
                    <Trees size={48} color="#cbd5e1" />
                    <p>No carbon sink data found</p>
                    <button className="btn-primary" onClick={handleAddNew}>
                      <Plus size={18} />
                      Add Your First Carbon Sink
                    </button>
                  </td>
                </tr>
              ) : (
                filteredData.map(sink => (
                  <tr key={sink.id}>
                    <td className="td-name">
                      <Leaf size={16} color="#10b981" />
                      {sink.name}
                    </td>
                    <td>
                      <span className={`type-badge ${sink.type}`}>
                        {sink.type === 'afforestation' ? 'Afforestation' : 'Greenbelt'}
                      </span>
                    </td>
                    <td>{sink.area.toFixed(2)}</td>
                    <td>{new Date(sink.plantationDate).toLocaleDateString()}</td>
                    <td>{calculateAge(sink.plantationDate).toFixed(1)} yrs</td>
                    <td>{sink.species}</td>
                    <td>{sink.treeCount.toLocaleString()}</td>
                    <td>{(sink.growthRate * 100).toFixed(0)}%</td>
                    <td>
                      <MapPin size={14} className="inline-icon" />
                      {sink.location}
                    </td>
                    <td>
                      <span className={`status-badge ${sink.status}`}>
                        {sink.status}
                      </span>
                    </td>
                    <td className="td-sequestration">
                      <strong>{calculateSequestration(sink).toFixed(2)}</strong> tCO2e/yr
                    </td>
                    <td className="td-actions">
                      <button
                        className="btn-icon-table"
                        onClick={() => handleEdit(sink)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-icon-table danger"
                        onClick={() => handleDelete(sink.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        <div className="analytics-card">
          <div className="card-title">
            <BarChart3 size={20} />
            Sequestration by Zone
          </div>
          <div className="chart-bars">
            {sinkData.slice(0, 5).map((sink, index) => {
              const sequestration = calculateSequestration(sink);
              const maxSequestration = Math.max(...sinkData.map(s => calculateSequestration(s)));
              const percentage = (sequestration / maxSequestration) * 100;
              return (
                <div key={sink.id} className="chart-bar-item">
                  <div className="bar-label">{sink.name}</div>
                  <div className="bar-wrapper">
                    <div 
                      className="bar-fill"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">{sequestration.toFixed(2)} tCO2e/yr</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-title">
            <Calendar size={20} />
            Key Insights
          </div>
          <div className="insights-grid">
            <div className="insight-item">
              <div className="insight-icon">🌱</div>
              <div className="insight-content">
                <div className="insight-value">
                  {sinkData.filter(s => calculateAge(s.plantationDate) < 3).length}
                </div>
                <div className="insight-label">Young Plantations (&lt;3 yrs)</div>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon">🌳</div>
              <div className="insight-content">
                <div className="insight-value">
                  {sinkData.filter(s => s.status === 'mature').length}
                </div>
                <div className="insight-label">Mature Zones</div>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon">📈</div>
              <div className="insight-content">
                <div className="insight-value">
                  {((totalSequestration / totalTrees) * 100).toFixed(1)}%
                </div>
                <div className="insight-label">Avg Efficiency Rate</div>
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <div className="insight-value">
                  {(totalArea / sinkData.length).toFixed(1)} ha
                </div>
                <div className="insight-label">Avg Zone Size</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonSinkRegistry;