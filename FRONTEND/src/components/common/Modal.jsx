export function ModalOverlay({ onClose, children }) {
    return (<div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative z-10">{children}</div>
    </div>);
}
