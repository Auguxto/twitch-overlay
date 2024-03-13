use serde::Serialize;

#[derive(Serialize, Clone, Debug)]
pub struct Reply {
    pub id: String,
    pub sender: String,
    pub login: String,
    pub text: String,
}

#[derive(Serialize, Clone, Debug)]
pub struct Message {
    pub id: String,
    pub sender: String,
    pub login: String,
    pub text: String,
    pub color: String,
    pub is_action: bool,
    pub bits: u64,
    pub reply_to: Option<Reply>,
    pub timestamp: String,
}
