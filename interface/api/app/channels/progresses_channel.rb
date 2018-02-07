class ProgressesChannel < ApplicationCable::Channel
  def subscribed
    stream_from "progresses"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    if data["id"]
      prog = Progress.find(data['id'])
    elsif data["user_id"] && data["tutorial_id"]
      prog = Progress
        .where(user_id: data['user_id'])
        .where(tutorial_id: data['tutorial_id'])
        .first
    end

    if prog
      prog.update!(code: data["code"]) if data['code']
      prog.update!(step_id: data["step_id"]) if data['step_id']
      msg = { code: prog.code, step_id: prog.step_id }
      ActionCable.server.broadcast('progresses', msg)
    end
  end
end
