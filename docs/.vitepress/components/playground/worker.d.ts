/** Vite 将 SDK Worker 打包为独立模块资源；开发和生产使用同一个导入入口。 */
declare module "@mcfpp/dsb-worker?worker&url" {
  const workerUrl: string;
  export default workerUrl;
}
