export default function BookingForm({ onSubmit, children }) {
  return <form onSubmit={onSubmit}>{children}</form>;
}
