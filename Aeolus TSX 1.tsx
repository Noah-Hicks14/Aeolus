import React, { useState, useMemo } from 'react';
import { Search, Check, Filter, Download, Printer, ChevronRight, Package, Wind, Wrench, Zap, Box, AlertCircle, X, Plus, Minus, FileText, BarChart3, Layers, Edit3 } from 'lucide-react';

export default function Aeolus() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showExcluded, setShowExcluded] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [expandedItem, setExpandedItem] = useState(null);
  const [itemNotes, setItemNotes] = useState({});
  const [quantities, setQuantities] = useState({});

  const project = {
    name: "Highgate - LH - Lot 15001",
    address: "236 Westerly Dr, Yulee, FL 32097",
    homeSize: "1,775",
    bedrooms: 4,
    system: "Carrier Split Heat Pump",
    capacity: "35 kBtu/hr",
    seer: "14.5",
    hspf: "7.5"
  };

  const categoryMeta = {
    'Flexible Ductwork': { icon: Wind, color: 'blue' },
    'Rigid Ductwork': { icon: Box, color: 'teal' },
    'Collars & Connections': { icon: Layers, color: 'purple' },
    'Register Boots': { icon: Package, color: 'coral' },
    'Exhaust Fans & Hoods': { icon: Wind, color: 'amber' },
    'Duct Terminations': { icon: Box, color: 'pink' },
    'Support & Hangers': { icon: Wrench, color: 'gray' },
    'Sealants & Tape': { icon: Box, color: 'green' },
    'Misc Hardware': { icon: Wrench, color: 'gray' }
  };

  const colorMap = {
    blue: { bg: '#E6F1FB', border: '#378ADD', text: '#0C447C', textDark: '#042C53' },
    teal: { bg: '#E1F5EE', border: '#1D9E75', text: '#0F6E56', textDark: '#085041' },
    purple: { bg: '#EEEDFE', border: '#7F77DD', text: '#3C3489', textDark: '#26215C' },
    coral: { bg: '#FAECE7', border: '#D85A30', text: '#993C1D', textDark: '#712B13' },
    amber: { bg: '#FAEEDA', border: '#EF9F27', text: '#854F0B', textDark: '#633806' },
    pink: { bg: '#FBEAF0', border: '#D4537E', text: '#993556', textDark: '#72243E' },
    gray: { bg: '#F1EFE8', border: '#888780', text: '#444441', textDark: '#2C2C2A' },
    green: { bg: '#EAF3DE', border: '#639922', text: '#3B6D11', textDark: '#27500A' }
  };

  const data = {
    categories: [
      {
        id: 'flex',
        name: 'Flexible Ductwork',
        items: [
          { id: 'f1', material: 'FLEX 4"x25\' Bag', qty: 4, unit: 'bags', priority: 'high' },
          { id: 'f2', material: 'FLEX 5"x25\' Bag', qty: 1, unit: 'bags', priority: 'medium' },
          { id: 'f3', material: 'FLEX 6"x25\' Bag', qty: 6, unit: 'bags', priority: 'high' },
          { id: 'f4', material: 'FLEX 7"x25\' Bag', qty: 6, unit: 'bags', priority: 'high' },
          { id: 'f5', material: 'FLEX 8"x25\' Bag', qty: 1, unit: 'bags', priority: 'medium' },
          { id: 'f6', material: 'FLEX 10"x25\' Bag', qty: 1, unit: 'bags', priority: 'medium' },
          { id: 'f7', material: 'FLEX 12"x25\' Bag', qty: 2, unit: 'bags', priority: 'high' },
          { id: 'f8', material: 'FLEX 14"x25\' Bag', qty: 1, unit: 'bags', priority: 'medium' },
          { id: 'f9', material: 'FLEX 16"x25\' Bag', qty: 1, unit: 'bags', priority: 'medium' }
        ]
      },
      {
        id: 'rigid',
        name: 'Rigid Ductwork',
        items: [
          { id: 'r1', material: '1.5"x48"x120" Duct Board', qty: 3, unit: 'sheets', priority: 'high' }
        ]
      },
      {
        id: 'collars',
        name: 'Collars & Connections',
        items: [
          { id: 'c1', material: '4" Tab Lock Collar', qty: 4, unit: 'units', priority: 'high' },
          { id: 'c2', material: '5" Tab Lock Collar', qty: 1, unit: 'units', priority: 'medium' },
          { id: 'c3', material: '6" Tab Lock Collar', qty: 8, unit: 'units', priority: 'high' },
          { id: 'c4', material: '7" Tab Lock Collar', qty: 6, unit: 'units', priority: 'high' },
          { id: 'c5', material: '8" Tab Lock Collar', qty: 2, unit: 'units', priority: 'medium' },
          { id: 'c6', material: '10" Tab Lock Collar', qty: 2, unit: 'units', priority: 'medium' },
          { id: 'c7', material: '12" Tab Lock Collar', qty: 4, unit: 'units', priority: 'high' },
          { id: 'c8', material: '14" Tab Lock Collar', qty: 2, unit: 'units', priority: 'medium' },
          { id: 'c9', material: '16" Tab Lock Collar', qty: 2, unit: 'units', priority: 'medium' },
          { id: 'c10', material: '4" ADJ Elbow 26G', qty: 1, unit: 'units', priority: 'low' }
        ]
      },
      {
        id: 'boots',
        name: 'Register Boots',
        items: [
          { id: 'b1', material: '12x12 Boot', qty: 4, unit: 'units', priority: 'high' },
          { id: 'b2', material: '14x14 Boot', qty: 0, unit: 'units', excluded: true },
          { id: 'b3', material: '16x16 Boot', qty: 1, unit: 'units', priority: 'medium' },
          { id: 'b4', material: '8x4-4 Boot', qty: 4, unit: 'units', priority: 'high' },
          { id: 'b5', material: '10x6x5 Boot', qty: 1, unit: 'units', priority: 'medium' },
          { id: 'b6', material: '10x6x6 Boot', qty: 4, unit: 'units', priority: 'high' },
          { id: 'b7', material: '12x6x7 Boot', qty: 6, unit: 'units', priority: 'high' },
          { id: 'b8', material: '12x6x8 Boot', qty: 0, unit: 'units', excluded: true }
        ]
      },
      {
        id: 'fans',
        name: 'Exhaust Fans & Hoods',
        items: [
          { id: 'e1', material: 'Broan AE80 Exhaust Fan', qty: 3, unit: 'units', priority: 'high' },
          { id: 'e2', material: 'Fan/Light Combo', qty: 0, unit: 'units', excluded: true },
          { id: 'e3', material: 'Hood Stack 10"x3"', qty: 2, unit: 'units', priority: 'medium' },
          { id: 'e4', material: 'Hood Rectangle to Round', qty: 1, unit: 'units', priority: 'medium' },
          { id: 'e5', material: 'Hood Rectangle Elbow', qty: 1, unit: 'units', priority: 'medium' }
        ]
      },
      {
        id: 'terminations',
        name: 'Duct Terminations',
        items: [
          { id: 't1', material: '4" Square Soffit Vent', qty: 3, unit: 'pieces', priority: 'medium' }
        ]
      },
      {
        id: 'support',
        name: 'Support & Hangers',
        items: [
          { id: 's1', material: '4\'x4" Metal Pipe', qty: 30, unit: 'pieces', priority: 'high' },
          { id: 's2', material: 'Boot Rails 26GA', qty: 1, unit: 'box', priority: 'medium' },
          { id: 's3', material: 'Panduit Strap', qty: 2, unit: 'bags', priority: 'high' },
          { id: 's4', material: 'Duct Strap Black', qty: 2, unit: 'rolls', priority: 'high' }
        ]
      },
      {
        id: 'sealants',
        name: 'Sealants & Tape',
        items: [
          { id: 'sl1', material: 'Mastic 1 Gallon', qty: 4, unit: 'gallons', priority: 'high' },
          { id: 'sl2', material: '1/2" Mastic Brush', qty: 2, unit: 'units', priority: 'medium' },
          { id: 'sl3', material: '2-1/2" Silver SMACNA Tape', qty: 2, unit: 'rolls', priority: 'high' },
          { id: 'sl4', material: 'Blk Duct Tape', qty: 1, unit: 'roll', priority: 'medium' },
          { id: 'sl5', material: 'Spray Foam', qty: 1, unit: 'can', priority: 'low' }
        ]
      },
      {
        id: 'misc',
        name: 'Misc Hardware',
        items: [
          { id: 'm1', material: '4"x8\' T-Fin', qty: 4, unit: 'pieces', priority: 'medium' },
          { id: 'm2', material: '18-8 UL Thermostat Wire', qty: 1, unit: 'roll', priority: 'high' },
          { id: 'm3', material: 'Nail Plate', qty: 0, unit: 'units', excluded: true }
        ]
      }
    ]
  };

  const stats = useMemo(() => {
    let totalItems = 0, totalQty = 0, excluded = 0, checked = 0;
    data.categories.forEach(cat => {
      cat.items.forEach(item => {
        if (item.excluded) {
          excluded++;
        } else {
          totalItems++;
          totalQty += quantities[item.id] !== undefined ? quantities[item.id] : item.qty;
          if (checkedItems.has(item.id)) checked++;
        }
      });
    });
    return { totalItems, totalQty, excluded, checked, completion: totalItems > 0 ? Math.round((checked / totalItems) * 100) : 0 };
  }, [checkedItems, quantities]);

  const filteredCategories = useMemo(() => {
    return data.categories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        if (!showExcluded && item.excluded) return false;
        if (activeCategory !== 'all' && cat.id !== activeCategory) return false;
        if (searchQuery && !item.material.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      })
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery, activeCategory, showExcluded]);

  const toggleCheck = (id) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const adjustQty = (id, delta, original) => {
    const current = quantities[id] !== undefined ? quantities[id] : original;
    const newVal = Math.max(0, current + delta);
    setQuantities(prev => ({ ...prev, [id]: newVal }));
  };

  const exportList = () => {
    let text = `AEOLUS — HVAC MATERIALS LIST\n`;
    text += `${project.name}\n${project.address}\n`;
    text += `${project.homeSize} sq ft | ${project.bedrooms} BR | ${project.system}\n`;
    text += `Generated: ${new Date().toLocaleDateString()}\n`;
    text += `${'═'.repeat(60)}\n\n`;
    data.categories.forEach(cat => {
      const items = cat.items.filter(i => !i.excluded);
      if (items.length === 0) return;
      text += `\n${cat.name.toUpperCase()}\n${'─'.repeat(60)}\n`;
      items.forEach(item => {
        const q = quantities[item.id] !== undefined ? quantities[item.id] : item.qty;
        const checked = checkedItems.has(item.id) ? '[✓]' : '[ ]';
        text += `${checked} ${item.material.padEnd(40)} ${q} ${item.unit}\n`;
        if (itemNotes[item.id]) text += `      Note: ${itemNotes[item.id]}\n`;
      });
    });
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Aeolus_Materials.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const allCategories = [
    { id: 'all', name: 'All Categories', count: stats.totalItems },
    ...data.categories.map(c => ({
      id: c.id,
      name: c.name,
      count: c.items.filter(i => !i.excluded).length
    }))
  ];

  return (
    <div style={{ padding: '1rem 0', fontFamily: 'var(--font-sans)', maxWidth: '1100px', color: 'var(--color-text-primary)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: 'var(--border-radius-md)',
            background: '#E6F1FB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0C447C'
          }}>
            <Wind size={20} strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Aeolus</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>HVAC materials intelligence</p>
          </div>
        </div>

        <div style={{
          padding: '1.25rem',
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-lg)',
          border: '0.5px solid var(--color-border-tertiary)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '1rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 500 }}>{project.name}</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>{project.address}</p>
            </div>
            <div style={{
              padding: '4px 10px',
              background: '#E1F5EE',
              color: '#0F6E56',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '12px',
              fontWeight: 500
            }}>
              Active project
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
            {[
              { label: 'Home size', value: `${project.homeSize} ft²` },
              { label: 'Bedrooms', value: project.bedrooms },
              { label: 'System', value: project.capacity },
              { label: 'SEER2', value: project.seer },
              { label: 'HSPF2', value: project.hspf }
            ].map((s, i) => (
              <div key={i} style={{
                padding: '10px 12px',
                background: 'var(--color-background-primary)',
                borderRadius: 'var(--border-radius-md)',
                border: '0.5px solid var(--color-border-tertiary)'
              }}>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '15px', fontWeight: 500 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        padding: '1rem 1.25rem',
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-lg)',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={14} color="var(--color-text-secondary)" />
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Procurement progress</span>
          </div>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{stats.checked}</span> of {stats.totalItems} items · {stats.completion}%
          </span>
        </div>
        <div style={{
          height: '6px',
          background: 'var(--color-background-secondary)',
          borderRadius: '999px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${stats.completion}%`,
            background: '#1D9E75',
            borderRadius: '999px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '1rem' }}>
        {[
          { label: 'Line items', value: stats.totalItems, color: '#0C447C', bg: '#E6F1FB' },
          { label: 'Total quantity', value: stats.totalQty, color: '#3C3489', bg: '#EEEDFE' },
          { label: 'Excluded', value: stats.excluded, color: '#444441', bg: '#F1EFE8' },
          { label: 'Categories', value: data.categories.length, color: '#0F6E56', bg: '#E1F5EE' }
        ].map((stat, i) => (
          <div key={i} style={{
            padding: '12px 14px',
            background: stat.bg,
            borderRadius: 'var(--border-radius-md)'
          }}>
            <p style={{ margin: 0, fontSize: '11px', color: stat.color, textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.8 }}>{stat.label}</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '22px', fontWeight: 500, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px' }}>
          <Search size={14} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-tertiary)',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '34px',
              fontSize: '13px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={() => setShowExcluded(!showExcluded)}
          style={{
            padding: '8px 12px',
            fontSize: '13px',
            background: showExcluded ? '#FAEEDA' : 'transparent',
            color: showExcluded ? '#854F0B' : 'var(--color-text-primary)',
            border: `0.5px solid ${showExcluded ? '#EF9F27' : 'var(--color-border-secondary)'}`,
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 500
          }}
        >
          <Filter size={13} />
          {showExcluded ? 'Hide excluded' : 'Show excluded'}
        </button>

        <button
          onClick={exportList}
          style={{
            padding: '8px 12px',
            fontSize: '13px',
            background: 'transparent',
            border: '0.5px solid var(--color-border-secondary)',
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 500
          }}
        >
          <Download size={13} />
          Export
        </button>
      </div>

      {/* Category pills */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '1.25rem',
        flexWrap: 'wrap'
      }}>
        {allCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 500,
              background: activeCategory === cat.id ? 'var(--color-text-primary)' : 'transparent',
              color: activeCategory === cat.id ? 'var(--color-background-primary)' : 'var(--color-text-secondary)',
              border: `0.5px solid ${activeCategory === cat.id ? 'var(--color-text-primary)' : 'var(--color-border-tertiary)'}`,
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {cat.name}
            <span style={{
              padding: '1px 6px',
              fontSize: '11px',
              background: activeCategory === cat.id ? 'rgba(255,255,255,0.2)' : 'var(--color-background-secondary)',
              borderRadius: '999px',
              fontWeight: 500
            }}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Categories */}
      {filteredCategories.length === 0 ? (
        <div style={{
          padding: '3rem 1rem',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-lg)'
        }}>
          <Search size={20} style={{ opacity: 0.4, marginBottom: '8px' }} />
          <p style={{ margin: 0, fontSize: '14px' }}>No materials match your search</p>
        </div>
      ) : (
        filteredCategories.map(category => {
          const meta = categoryMeta[category.name] || { icon: Box, color: 'gray' };
          const Icon = meta.icon;
          const colors = colorMap[meta.color];
          const totalCatQty = category.items.filter(i => !i.excluded).reduce((sum, item) => {
            return sum + (quantities[item.id] !== undefined ? quantities[item.id] : item.qty);
          }, 0);

          return (
            <div key={category.id} style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '0.5px solid var(--color-border-tertiary)'
              }}>
                <div style={{
                  width: '28px', height: '28px',
                  borderRadius: 'var(--border-radius-md)',
                  background: colors.bg,
                  color: colors.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={14} strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{category.name}</h2>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  {category.items.filter(i => !i.excluded).length} items · {totalCatQty} units
                </span>
              </div>

              <div style={{ display: 'grid', gap: '6px' }}>
                {category.items.map(item => {
                  const isChecked = checkedItems.has(item.id);
                  const isExpanded = expandedItem === item.id;
                  const currentQty = quantities[item.id] !== undefined ? quantities[item.id] : item.qty;

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: item.excluded ? 'var(--color-background-secondary)' : 'var(--color-background-primary)',
                        border: `0.5px solid ${isChecked ? colors.border : 'var(--color-border-tertiary)'}`,
                        borderLeft: isChecked ? `2px solid ${colors.border}` : `0.5px solid var(--color-border-tertiary)`,
                        borderRadius: 'var(--border-radius-md)',
                        opacity: item.excluded ? 0.55 : 1,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        {!item.excluded && (
                          <button
                            onClick={() => toggleCheck(item.id)}
                            style={{
                              width: '18px', height: '18px',
                              minWidth: '18px',
                              padding: 0,
                              borderRadius: '4px',
                              border: `1px solid ${isChecked ? colors.border : 'var(--color-border-secondary)'}`,
                              background: isChecked ? colors.border : 'transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white'
                            }}
                          >
                            {isChecked && <Check size={11} strokeWidth={3} />}
                          </button>
                        )}

                        {item.excluded && (
                          <div style={{
                            width: '18px', height: '18px',
                            minWidth: '18px',
                            borderRadius: '4px',
                            border: '0.5px dashed var(--color-border-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-tertiary)'
                          }}>
                            <X size={10} strokeWidth={2} />
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            margin: 0,
                            fontSize: '13px',
                            fontWeight: 500,
                            textDecoration: isChecked ? 'line-through' : 'none',
                            color: isChecked ? 'var(--color-text-secondary)' : 'var(--color-text-primary)'
                          }}>
                            {item.material}
                          </p>
                          {item.excluded && (
                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                              Excluded from this build
                            </p>
                          )}
                        </div>

                        {!item.excluded ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              onClick={() => adjustQty(item.id, -1, item.qty)}
                              style={{
                                width: '22px', height: '22px',
                                padding: 0,
                                borderRadius: '4px',
                                border: '0.5px solid var(--color-border-tertiary)',
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-text-secondary)'
                              }}
                            >
                              <Minus size={11} />
                            </button>
                            <div style={{
                              minWidth: '60px',
                              textAlign: 'center',
                              fontSize: '13px',
                              fontWeight: 500
                            }}>
                              {currentQty} <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400, fontSize: '12px' }}>{item.unit}</span>
                            </div>
                            <button
                              onClick={() => adjustQty(item.id, 1, item.qty)}
                              style={{
                                width: '22px', height: '22px',
                                padding: 0,
                                borderRadius: '4px',
                                border: '0.5px solid var(--color-border-tertiary)',
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-text-secondary)'
                              }}
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        ) : (
                          <div style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            background: 'var(--color-background-tertiary)',
                            borderRadius: '4px',
                            color: 'var(--color-text-tertiary)',
                            fontWeight: 500
                          }}>
                            XXXX
                          </div>
                        )}

                        {!item.excluded && (
                          <button
                            onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                            style={{
                              width: '24px', height: '24px',
                              padding: 0,
                              borderRadius: '4px',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--color-text-tertiary)',
                              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                              transition: 'transform 0.15s ease'
                            }}
                          >
                            <ChevronRight size={14} />
                          </button>
                        )}
                      </div>

                      {isExpanded && !item.excluded && (
                        <div style={{
                          padding: '0 12px 12px 40px',
                          borderTop: '0.5px solid var(--color-border-tertiary)',
                          paddingTop: '10px',
                          marginTop: '2px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                            <Edit3 size={11} color="var(--color-text-tertiary)" />
                            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>
                              Notes
                            </span>
                          </div>
                          <textarea
                            placeholder="Add notes for this item..."
                            value={itemNotes[item.id] || ''}
                            onChange={(e) => setItemNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                            style={{
                              width: '100%',
                              minHeight: '50px',
                              padding: '8px',
                              fontSize: '12px',
                              border: '0.5px solid var(--color-border-tertiary)',
                              borderRadius: 'var(--border-radius-md)',
                              boxSizing: 'border-box',
                              fontFamily: 'inherit',
                              resize: 'vertical',
                              background: 'var(--color-background-secondary)'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {/* Footer */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem 1.25rem',
        background: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={14} color="var(--color-text-secondary)" />
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Calibrated to your company specifications · Generated {new Date().toLocaleDateString()}
          </span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', fontWeight: 500 }}>
          Aeolus v1.0
        </span>
      </div>
    </div>
  );
}