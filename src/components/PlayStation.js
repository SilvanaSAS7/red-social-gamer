import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PlayStation = () => {
  const juegosPopulares = [
    {
      id: 1,
      nombre: "God of War Ragnarök",
      imagen: "https://cdn.wccftech.com/wp-content/uploads/2022/07/dIQGI36BxDE-HD-HD-scaled.jpg",
      url: "https://www.playstation.com/es-es/games/god-of-war-ragnarok/"
    },
    {
      id: 2,
      nombre: "Marvel's Spider-Man 2",
      imagen: "https://tse2.mm.bing.net/th/id/OIP.xEK0eiNKTtshgICHRBp44QHaEK?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3",
      url: "https://www.playstation.com/es-es/games/marvels-spider-man-2/"
    },
    {
      id: 3,
      nombre: "The Last of Us Part II",
      imagen: "https://image.api.playstation.com/vulcan/img/rnd/202010/2618/itbSm3suGHSSHIpmu9CCPBRy.jpg",
      url: "https://www.playstation.com/es-es/games/the-last-of-us-part-ii/"
    },
    {
      id: 4,
      nombre: "Horizon Forbidden West",
      imagen: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/09/horizon-zero-dawn-remastered-cover-2.jpg",
      url: "https://www.playstation.com/es-es/games/horizon-forbidden-west/"
    },
    {
      id: 5,
      nombre: "Gran Turismo 7",
      imagen: "https://tse3.mm.bing.net/th/id/OIP.Bdcu1OVJRz1_7lHbrt81xAHaEK?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3",
      url: "https://www.playstation.com/es-es/games/gran-turismo-7/"
    }
  ];

  const [noticias, setNoticias] = useState([]);
  const [noticiasFiltradas, setNoticiasFiltradas] = useState([]);

  useEffect(() => {
    // Simulación de fetch de noticias (puedes reemplazar por tu API real)
    const noticiasEjemplo = [
      { id: 1, titulo: "PlayStation lanza nuevo juego exclusivo", contenido: "Detalles del lanzamiento...", url: "https://blog.playstation.com/es/" },
      { id: 2, titulo: "Xbox Game Pass agrega títulos", contenido: "Novedades en Xbox...", url: "https://news.xbox.com/es-latam/" },
      { id: 3, titulo: "PlayStation actualiza su consola", contenido: "Mejoras en hardware...", url: "https://blog.playstation.com/es/" },
      { id: 4, titulo: "Nintendo Switch recibe actualización", contenido: "Actualización de sistema...", url: "https://www.nintendo.com/es_LA/whatsnew/" }
    ];
    setNoticias(noticiasEjemplo);
  }, []);

  useEffect(() => {
    const filtradas = noticias.filter(noticia =>
      noticia.titulo.toLowerCase().includes('playstation')
    );
    setNoticiasFiltradas(filtradas);
  }, [noticias]);

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

  return (
    <div style={{
      background: 'linear-gradient(135deg, #003087 0%, #001a44 100%)',
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
      }}>PlayStation News</h1>
      {/* Noticias filtradas por PlayStation */}
      <div style={{
        marginBottom: '30px',
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderRadius: '10px',
        padding: '20px'
      }}>
        <h2 style={{ color: '#ffcc00', textAlign: 'center', fontSize: '1.5rem', marginBottom: '15px' }}>Noticias PlayStation</h2>
        {noticiasFiltradas.length === 0 ? (
          <p style={{ color: '#fff', textAlign: 'center' }}>No hay noticias de PlayStation.</p>
        ) : (
          noticiasFiltradas.slice(0, Math.max(3, noticiasFiltradas.length)).map(noticia => (
            <div key={noticia.id} style={{ marginBottom: '18px', padding: '10px', background: 'rgba(0,0,0,0.08)', borderRadius: '8px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '6px' }}>
                <a href={noticia.url} target="_blank" rel="noopener noreferrer" style={{ color: '#ffcc00', textDecoration: 'underline' }}>
                  {noticia.titulo}
                </a>
              </h3>
              <p style={{ color: '#ccc', fontSize: '1rem' }}>{noticia.contenido}</p>
            </div>
          ))
        )}
      </div>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
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
              <a href={juego.url} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#333'}}>
                <img 
                  src={juego.imagen}
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
