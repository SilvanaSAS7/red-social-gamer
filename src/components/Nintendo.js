import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Nintendo = () => {
  const [noticias, setNoticias] = useState([]);
  
  const juegosPopulares = [
    {
      id: 1,
      nombre: "The Legend of Zelda: Tears of the Kingdom",
      imagen: "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/ncom/en_US/games/switch/t/the-legend-of-zelda-tears-of-the-kingdom-switch/hero",
      url: "https://www.nintendo.com/es_LA/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/"
    },
    {
      id: 2,
      nombre: "Super Mario Bros. Wonder",
      imagen: "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/ncom/en_US/games/switch/s/super-mario-bros-wonder-switch/hero",
      url: "https://www.nintendo.com/es_LA/store/products/super-mario-bros-wonder-switch/"
    },
    {
      id: 3,
      nombre: "Animal Crossing: New Horizons",
      imagen: "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/ncom/en_US/games/switch/a/animal-crossing-new-horizons-switch/hero",
      url: "https://www.nintendo.com/es_LA/store/products/animal-crossing-new-horizons-switch/"
    },
    {
      id: 4,
      nombre: "Pokémon Scarlet/Violet",
      imagen: "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/ncom/en_US/games/switch/p/pokemon-scarlet-switch/hero",
      url: "https://www.nintendo.com/es_LA/store/products/pokemon-scarlet-switch/"
    },
    {
      id: 5,
      nombre: "Splatoon 3",
      imagen: "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/ncom/en_US/games/switch/s/splatoon-3-switch/hero",
      url: "https://www.nintendo.com/es_LA/store/products/splatoon-3-switch/"
    }
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
      { id: 1, titulo: "Nuevo Nintendo Direct anunciado para próximo mes", fecha: "Hace 5 horas", url: "https://www.nintendo.com/es_LA/whatsnew/" },
      { id: 2, titulo: "Actualización de sistema resuelve problemas de conectividad", fecha: "Ayer", url: "https://www.nintendo.com/es_LA/whatsnew/" },
      { id: 3, titulo: "Remake de clásico de GameCube en desarrollo", fecha: "Hace 4 días", url: "https://www.nintendo.com/es_LA/whatsnew/" }
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

  // Filtrar noticias que incluyan "Nintendo" en el título (no sensible a mayúsculas)
  const noticiasFiltradas = noticias.filter(noticia => noticia.titulo.toLowerCase().includes('nintendo'));

  return (
    <div style={{
      background: 'linear-gradient(135deg, #e60012 0%, #b0000e 100%)',
      color: 'white',
      padding: '25px',
      borderRadius: '15px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      minHeight: '100vh',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }}>
      <h1 style={{
        color: '#ffffff',
        textAlign: 'center',
        fontSize: '2.5rem',
        marginBottom: '30px',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }}>Nintendo News</h1>
      {/* Sección de Noticias filtradas */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          color: '#ffde00',
          borderBottom: '2px solid #ffde00',
          paddingBottom: '10px',
          marginBottom: '20px'
        }}>Noticias Recientes</h2>
        <div>
          {noticiasFiltradas.length === 0 ? (
            <div style={{color:'#ffed80', textAlign:'center'}}>No hay noticias de Nintendo.</div>
          ) : (
            noticiasFiltradas.slice(0, Math.max(3, noticiasFiltradas.length)).map(noticia => (
              <div key={noticia.id} style={{
                background: 'rgba(230, 0, 18, 0.5)',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                transition: 'transform 0.3s ease',
                borderLeft: '4px solid #ffde00'
              }}>
                <h3>
                  <a href={noticia.url} target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'underline' }}>
                    {noticia.titulo}
                  </a>
                </h3>
                <span style={{color: '#ffed80', fontSize: '0.85rem'}}>{noticia.fecha}</span>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Carrusel de Juegos Exclusivos */}
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
              <a href={juego.url} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#333'}}>
                <img 
                  src={juego.imagen}
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