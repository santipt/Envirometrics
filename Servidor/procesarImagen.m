%------------------------------------------------------------
% Imagen ->
%   procesarImagen()
% Imagen <-
%------------------------------------------------------------
function procesarImagen()
image=imread('./Imagenes_A_Procesar/paraProcesar.jpg');

%  Se comprueba si es escala de grises y si no lo es se vuelve escala de
%  grises
%------------------------------------------------------------
if size(image,3)==3
    image=rgb2gray(image);
end

T = graythresh(image);
BW = imbinarize(image, T);
BW2 = imcomplement(BW);

imwrite(BW2, './Imagenes_Procesadas/binaria.jpg')
end