import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PlayStation = () => {
  const [noticias, setNoticias] = useState([]);
  
  const juegosPopulares = [
    { id: 1, nombre: "God of War Ragnarök", imagen: "gow_ragnarok.jpg", url: "#" },
    { id: 2, nombre: "Marvel's Spider-Man 2", imagen: "spiderman2.jpg", url: "#" },
    { id: 3, nombre: "The Last of Us Part II", imagen: "tlou2.jpg", url: "#" },
    { id: 4, nombre: "Horizon Forbidden West", imagen: "horizon.jpg", url: "#" },
    { id: 5, nombre: "Gran Turismo 7", imagen: "gt7.jpg", url: "#" }
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
      { id: 1, titulo: "Nuevo DLC para God of War anunciado", fecha: "Hace 2 horas" },
      { id: 2, titulo: "PlayStation 5 supera los 50 millones de unidades vendidas", fecha: "Hace 1 día" },
      { id: 3, titulo: "Exclusivo: Avances del próximo juego de Naughty Dog", fecha: "Hace 3 días" }
    ];
    
    setNoticias(noticiasIniciales);
    
    const interval = setInterval(() => {
      if (noticias.length > 0) {
        const nuevaNoticia = {
          id: noticias.length + 1,
          titulo: `Actualización ${noticias.length + 1} - Nuevos contenidos disponibles`,
          fecha: "Ahora mismo"
        };
        setNoticias(prev => [nuevaNoticia, ...prev.slice(0, 4)]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [noticias.length]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #003087 0%, #001a44 100%)',
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
      }}>PlayStation News</h1>
      
      {/* Sección de Noticias */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          color: '#00b2ff',
          borderBottom: '2px solid #00b2ff',
          paddingBottom: '10px',
          marginBottom: '20px'
        }}>Últimas Noticias</h2>
        <div>
          {noticias.map(noticia => (
            <div key={noticia.id} style={{
              background: 'rgba(0, 52, 135, 0.5)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              transition: 'transform 0.3s ease',
              borderLeft: '4px solid #00b2ff'
            }}>
              <h3>{noticia.titulo}</h3>
              <span style={{color: '#a0d0ff', fontSize: '0.85rem'}}>{noticia.fecha}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Carrusel de Juegos Populares */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          color: '#ffcc00',
          textAlign: 'center',
          marginBottom: '25px',
          fontSize: '1.8rem'
        }}>Juegos Populares</h2>
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
                    border: '3px solid #ffffff',
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

export default PlayStation;