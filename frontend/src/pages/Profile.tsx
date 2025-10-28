import { useState, useEffect } from 'react';
import { userAPI } from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import Navbar from '../components/Navbar';
import type { Profile as ProfileType } from '../types';
import { ACTIVITY_LEVELS, GOALS } from '../utils/constants';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    currentWeight: '',
    targetWeight: '',
    activityLevel: 'moderado' as const,
    goal: 'manter_peso' as const,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await userAPI.getProfile();
      setProfile(data);
      setFormData({
        currentWeight: data.currentWeight.toString(),
        targetWeight: data.targetWeight?.toString() || '',
        activityLevel: data.activityLevel,
        goal: data.goal,
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await userAPI.updateProfile({
        currentWeight: parseFloat(formData.currentWeight),
        targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined,
        activityLevel: formData.activityLevel,
        goal: formData.goal,
      });
      await loadProfile();
      setEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>
            </div>
            <button onClick={logout} className="btn-secondary text-red-600">
              Sair
            </button>
          </div>

          {profile && !editing && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Idade</p>
                  <p className="font-medium">{calculateAge(profile.birthDate)} anos</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Altura</p>
                  <p className="font-medium">{profile.height} cm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Peso Atual</p>
                  <p className="font-medium">{profile.currentWeight} kg</p>
                </div>
                {profile.targetWeight && (
                  <div>
                    <p className="text-sm text-gray-600">Peso Desejado</p>
                    <p className="font-medium">{profile.targetWeight} kg</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Atividade Física</p>
                  <p className="font-medium">{ACTIVITY_LEVELS[profile.activityLevel]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Objetivo</p>
                  <p className="font-medium">{GOALS[profile.goal]}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Metas Diárias</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Calorias</p>
                    <p className="text-xl font-bold text-primary-600">
                      {profile.dailyCalories} kcal
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Proteínas</p>
                    <p className="text-xl font-bold text-blue-600">{profile.dailyProtein}g</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Carboidratos</p>
                    <p className="text-xl font-bold text-yellow-600">{profile.dailyCarbs}g</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Gorduras</p>
                    <p className="text-xl font-bold text-red-600">{profile.dailyFat}g</p>
                  </div>
                </div>
              </div>

              <button onClick={() => setEditing(true)} className="btn-primary">
                Editar Perfil
              </button>
            </div>
          )}

          {editing && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso Atual (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.currentWeight}
                    onChange={(e) =>
                      setFormData({ ...formData, currentWeight: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso Desejado (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.targetWeight}
                    onChange={(e) =>
                      setFormData({ ...formData, targetWeight: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nível de Atividade Física
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, activityLevel: e.target.value as any })
                  }
                  className="input-field"
                >
                  {Object.entries(ACTIVITY_LEVELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
                  className="input-field"
                >
                  {Object.entries(GOALS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
