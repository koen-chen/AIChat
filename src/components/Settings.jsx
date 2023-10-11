import { Modal, Slider, Text } from '@mantine/core'

export default function Settings({ openSettings, handleCloseSettings, temperature, setTemperature }) {
  return (
   <Modal centered opened={openSettings} onClose={handleCloseSettings} title="设置客服系统参数">
    <div className="p-10">
      <Text size="sm" className="mb-2">回答多样性 (数值越大，多样性越高)</Text>
      <Slider
        value={temperature}
        onChange={setTemperature}
        color="blue"
        min={0}
        max={1}
        step={0.1}
      />
    </div>
  </Modal>
  )
}