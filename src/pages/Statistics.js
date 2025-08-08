import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Datos simulados de usuarios y usuarios conectados
const data = [
  { name: 'Enero', usuarios: 120, conectados: 80 },
  { name: 'Febrero', usuarios: 150, conectados: 100 },
  { name: 'Marzo', usuarios: 170, conectados: 130 },
  { name: 'Abril', usuarios: 200, conectados: 160 },
  { name: 'Mayo', usuarios: 220, conectados: 180 },
  { name: 'Junio', usuarios: 250, conectados: 210 },
  { name: 'Julio', usuarios: 270, conectados: 230 },
];

// Datos simulados para el histograma de jugadores en torneos
const torneoData = [
  { categoria: 'Fornite', jugadores: 45, fill: '#8884d8' },
  { categoria: 'Warzone', jugadores: 32, fill: '#82ca9d' },
  { categoria: 'Free Fire', jugadores: 54, fill: '#ff7300' },
];

const Statistics = () => {
  return (
    <div style={{ width: '100%', padding: 24 }}>
      <h2>Estadísticas de Usuarios</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="usuarios" stroke="#8884d8" name="Usuarios Totales" />
          <Line type="monotone" dataKey="conectados" stroke="#82ca9d" name="Usuarios Conectados" />
        </LineChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: 40 }}>Jugadores en Torneos por Categoría</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={torneoData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="categoria" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="jugadores" name="Jugadores" barSize={60}>
            {torneoData.map((entry, index) => (
              <cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Statistics;
