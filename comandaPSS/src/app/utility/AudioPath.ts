export interface audioPath {
  name: string;
  path: string;
}

/*
  -----------------
  -Recordatorio :)-
  -----------------

  - Cuando se agrega un audio a los assets se tiene que ejecutar
  el comando " ionic build " para que se actualize la carpeta
  www, caso contrario no se van a pasar los audios a la aplicacion
  de android.

*/

export const audio: audioPath[] = [];
