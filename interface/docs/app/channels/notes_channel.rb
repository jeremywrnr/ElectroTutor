class NotesChannel < ApplicationCable::Channel
  def subscribed
     stream_from "notes"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    note = Note.find(data["id"])
    note.update!(code: data["code"])
    ActionCable.server.broadcast('notes', data)
  end
end
