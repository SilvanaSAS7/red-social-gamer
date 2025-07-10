import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Nintendo = () => {
  const [noticias, setNoticias] = useState([]);
  
  const juegosPopulares = [
    { id: 1, nombre: "The Legend of Zelda: Tears of the Kingdom", imagen: "zelda_tears.jpg", url: "#" },
    { id: 2, nombre: "Super Mario Bros. Wonder", imagen: "mario_wonder.jpg", url: "#" },
    { id: 3, nombre: "Animal Crossing: New Horizons", imagen: "animal_crossing.jpg", url: "#" },
    { id: 4, nombre: "Pokémon Scarlet/Violet", imagen: "pokemon_sv.jpg", url: "#" },
    { id: 5, nombre: "Splatoon 3", imagen: "splatoon3.jpg", url: "#" }
  ];

  const carruselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    const noticiasIniciales = [
      { id: 1, titulo: "Nuevo Nintendo Direct anunciado para próximo mes", fecha: "Hace 5 horas" },
      { id: 2, titulo: "Actualización de sistema resuelve problemas de conectividad", fecha: "Ayer" },
      { id: 3, titulo: "Remake de clásico de GameCube en desarrollo", fecha: "Hace 4 días" }
    ];
    
    setNoticias(noticiasIniciales);
    
    const interval = setInterval(() => {
      if (noticias.length > 0) {
        const nuevaNoticia = {
          id: noticias.length + 1,
          titulo: `Actualización ${noticias.length + 1} - Eventos en Nintendo Switch`,
          fecha: "Recién publicado"
        };
        setNoticias(prev => [nuevaNoticia, ...prev.slice(0, 4)]);
      }
    }, 35000);

    return () => clearInterval(interval);
  }, [noticias.length]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #e60012 0%, #b0000e 100%)',
      color: 'white',
      padding: '25px',
      borderRadius: '15px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    }}>
      <h1 style={{
        color: '#ffffff',
        textAlign: 'center',
        fontSize: '2.5rem',
        marginBottom: '30px',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }}>Nintendo News</h1>
      
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          color: '#ffde00',
          borderBottom: '2px solid #ffde00',
          paddingBottom: '10px',
          marginBottom: '20px'
        }}>Noticias Recientes</h2>
        <div>
          {noticias.map(noticia => (
            <div key={noticia.id} style={{
              background: 'rgba(230, 0, 18, 0.5)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              transition: 'transform 0.3s ease',
              borderLeft: '4px solid #ffde00'
            }}>
              <h3>{noticia.titulo}</h3>
              <span style={{color: '#ffed80', fontSize: '0.85rem'}}>{noticia.fecha}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          color: '#e60012',
          textAlign: 'center',
          marginBottom: '25px',
          fontSize: '1.8rem',
          backgroundColor: '#ffde00',
          padding: '8px',
          borderRadius: '8px'
        }}>Juegos Exclusivos</h2>
        <Slider {...carruselSettings}>
          {juegosPopulares.map(juego => (
            <div key={juego.id} style={{padding: '15px', textAlign: 'center'}}>
              <a href={juego.url} style={{textDecoration: 'none', color: '#333'}}>
                <img 
                  src={`/images/${juego.imagen}`} 
                  alt={juego.nombre}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: '3px solid #ffde00',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
                  }}
                />
                <p style={{fontWeight: 'bold', marginTop: '15px', fontSize: '1.1rem', color: '#ffffff'}}>{juego.nombre}</p>
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Nintendo;