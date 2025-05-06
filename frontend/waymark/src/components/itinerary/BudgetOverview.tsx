// src/components/itinerary/BudgetOverview.tsx
'use client'

import { useState } from 'react'
import { Card } from '../ui/card'
import { Progress } from '../ui/progress'
import { BadgeCheck, AlertCircle, DollarSign, Save, X, Edit2 } from 'lucide-react'

interface Props { 
  total: number; 
  spent: number;
  editable?: boolean;
  onSave?: (total: number, spent: number) => Promise<void>;
}

export default function BudgetOverview({ total, spent, editable = false, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTotal, setEditTotal] = useState(total);
  const [editSpent, setEditSpent] = useState(spent);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate display values
  const pct = Math.round((spent / total) * 100);
  const remaining = total - spent;
  
  // Determine budget status
  const getBudgetStatus = () => {
    if (pct <= 50) return 'good';
    if (pct <= 80) return 'warning';
    return 'critical';
  }
  
  const status = getBudgetStatus();
  
  // Handle save action
  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      await onSave(editTotal, editSpent);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save budget changes. Please try again.');
      console.error('Error saving budget:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Cancel editing and reset values
  const handleCancel = () => {
    setEditTotal(total);
    setEditSpent(spent);
    setIsEditing(false);
    setError(null);
  };
  
  // Render edit mode
  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Edit Budget</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-1.5" />
              )}
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4 mr-1.5" />
              Cancel
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="totalBudget" className="block text-sm font-medium text-gray-700 mb-1">
              Total Budget
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="totalBudget"
                min="0"
                step="100"
                value={editTotal}
                onChange={(e) => setEditTotal(Number(e.target.value))}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                placeholder="Total budget amount"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="spentBudget" className="block text-sm font-medium text-gray-700 mb-1">
              Amount Spent
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="spentBudget"
                min="0"
                step="100"
                value={editSpent}
                onChange={(e) => setEditSpent(Number(e.target.value))}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                placeholder="Amount spent"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render view mode
  return (
    <div className="relative text-center">
      {editable && (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-0 right-0 text-blue-500 hover:text-blue-700 flex items-center text-sm"
        >
          <Edit2 className="w-4 h-4 mr-1" />
          Edit
        </button>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <p className="text-sm text-gray-500 mb-1">Total Budget</p>
          <p className="text-2xl font-bold text-gray-800">${total.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <p className="text-sm text-gray-500 mb-1">Spent</p>
          <p className="text-2xl font-bold text-gray-800">${spent.toLocaleString()}</p>
          <p className="text-sm font-medium text-gray-600">{pct}% of total</p>
        </div>
      </div>
      
      <div className="space-y-2 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Budget Progress</span>
          <span className="text-gray-500">${spent.toLocaleString()} of ${total.toLocaleString()}</span>
        </div>
        <div className="relative pt-1">
          <Progress 
            value={pct} 
            className={`h-2 bg-gray-200 ${
              status === 'good' 
                ? 'bg-green-500' 
                : status === 'warning' 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
            }`}
          />
        </div>
        
        <p className={`text-sm font-medium mt-1 ${
          remaining > 0 
            ? 'text-green-600' 
            : 'text-red-600'
        }`}>
          {remaining > 0 
            ? `$${remaining.toLocaleString()} remaining` 
            : `$${Math.abs(remaining).toLocaleString()} over budget`}
        </p>
      </div>
      
      <div className="mt-4 flex justify-center">
        {status === 'good' && (
          <div className="inline-flex items-center text-green-600 text-sm bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <BadgeCheck className="w-4 h-4 mr-1.5" /> Under budget
          </div>
        )}
        {status === 'warning' && (
          <div className="inline-flex items-center text-yellow-600 text-sm bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200">
            <AlertCircle className="w-4 h-4 mr-1.5" /> Approaching limit
          </div>
        )}
        {status === 'critical' && (
          <div className="inline-flex items-center text-red-600 text-sm bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
            <AlertCircle className="w-4 h-4 mr-1.5" /> Near limit
          </div>
        )}
      </div>
    </div>
  )
}