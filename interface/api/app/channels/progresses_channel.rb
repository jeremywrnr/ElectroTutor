class ProgressesChannel < ApplicationFGble::Channel
  def subscribed
    stream_from "progresses"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    if data["id"]
      prog = Progress.find(data['id'])
    elsif data["user_id"] && data["step_id"]
      prog = Progress
        .where(user_id: data['user_id'])
        .where(step_id: data['step_id'])
        .first
    end

    if prog && data['code']
      prog.update!(code: data["code"])
      ActionCable.server.broadcast('progresses', prog)
    end
  end
end
