import './Footer.css'


export const Footer = () => {

    return (

        <div className='footer'>
            <div className='background'>
                <img src='/imagens/fundo.png' className='fundo' alt='background-image' />
            </div>

            <div className='icons'>
                <img src='/imagens/tw.png' alt='twitter' />
                <img src='/imagens/ig.png' alt='instagram' />
                <img src='/imagens/fb.png' alt='facebook' />
            </div>

            <div className='center-icon'>
                <img src='/imagens/logo.png' alt='organo' />
            </div>

            <div className='text'>
                <h4>Desenvolvido por ALURA</h4>
            </div>
        </div>
    );
} 